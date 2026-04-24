"use server";

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
});

const splitList = (value: FormDataEntryValue | undefined): string[] => {
  if (typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getOrCreateAuthorId = async (author: FormDataEntryValue | undefined) => {
  if (typeof author !== "string" || !author.trim()) {
    const fallback = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    if (!fallback) {
      throw new Error("No admin user found. Seed users first.");
    }
    return fallback.id;
  }

  const trimmed = author.trim();
  const byId = await prisma.user.findUnique({ where: { id: trimmed }, select: { id: true } });
  if (byId) {
    return byId.id;
  }

  const byUsername = await prisma.user.findUnique({
    where: { username: trimmed },
    select: { id: true },
  });
  if (byUsername) {
    return byUsername.id;
  }

  const byEmail = await prisma.user.findUnique({
    where: { email: trimmed },
    select: { id: true },
  });
  if (byEmail) {
    return byEmail.id;
  }

  const fallback = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (!fallback) {
    throw new Error("No admin user found. Seed users first.");
  }
  return fallback.id;
};

const resolveCategoryId = async (category: FormDataEntryValue | undefined) => {
  if (typeof category !== "string" || !category.trim()) {
    return null;
  }

  const value = category.trim();

  const byId = await prisma.postCategory.findUnique({
    where: { id: value },
    select: { id: true },
  });
  if (byId) {
    return byId.id;
  }

  const bySlug = await prisma.postCategory.findUnique({
    where: { slug: slugify(value) },
    select: { id: true },
  });
  if (bySlug) {
    return bySlug.id;
  }

  const created = await prisma.postCategory.create({
    data: {
      name: value,
      slug: slugify(value),
    },
    select: { id: true },
  });

  return created.id;
};

const uploadImageToCloudinary = async (imagesFile: File | null) => {
  if (!imagesFile || !imagesFile.size) {
    return null;
  }

  const arrayBuffer = await imagesFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "upload/products" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ secure_url: result?.secure_url ?? "" });
      },
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });

  return uploadResult.secure_url || null;
};

export const addPost = async (formData: FormData) => {
  const { author, slug, title, content, category, tags, featuredImage } = Object.fromEntries(formData);

  try {
    const authorId = await getOrCreateAuthorId(author);
    const categoryId = await resolveCategoryId(category);
    const tagItems = splitList(tags);

    await prisma.post.create({
      data: {
        title: String(title ?? ""),
        slug: String(slug ?? ""),
        content: String(content ?? ""),
        featuredImage: typeof featuredImage === "string" ? featuredImage : null,
        authorId,
        categoryId,
        publishedAt: new Date(),
        status: "PUBLISHED",
        tags: {
          create: tagItems.map((tag) => ({ tag })),
        },
      },
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.log(`Error creating post: ${error}`);
    return { error: "An Error occurred creating post" };
  }
};

export const updatePost = async (formData: FormData) => {
  const { id, author, slug, title, content, category, tags, featuredImage } = Object.fromEntries(formData);

  if (typeof id !== "string" || !id) {
    return { error: "Post ID is required" };
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingPost) {
      return { error: "Post not found" };
    }

    const authorId = await getOrCreateAuthorId(author ?? existingPost.authorId);
    const categoryId = await resolveCategoryId(category ?? existingPost.categoryId ?? undefined);
    const tagItems = splitList(tags);

    await prisma.post.update({
      where: { id },
      data: {
        authorId,
        slug: typeof slug === "string" && slug ? slug : existingPost.slug,
        title: typeof title === "string" && title ? title : existingPost.title,
        content: typeof content === "string" && content ? content : existingPost.content,
        featuredImage:
          typeof featuredImage === "string" && featuredImage
            ? featuredImage
            : existingPost.featuredImage,
        categoryId,
        tags: {
          deleteMany: {},
          create: tagItems.map((tag) => ({ tag })),
        },
      },
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.log(`Error updating post: ${error}`);
    return { error: "An Error occurred updating post" };
  }
};

export const deletePost = async (formData: FormData) => {
  const { id } = Object.fromEntries(formData);
  if (typeof id !== "string" || !id) {
    return { error: "Post ID is required" };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.log(`Error deleting post: ${error}`);
    return { error: "An error occurred while deleting the post" };
  }
};

type CreateUserBody = {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  firstname?: string;
  lastname?: string;
};

type CreateUserRequest = {
  body: CreateUserBody;
};

type JsonResponse = {
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

type OrderInputItem = {
  productVariantId?: string;
  productId?: string;
  quantity?: number;
  price?: number;
};

type OrderInput = {
  items?: OrderInputItem[];
  totalAmount?: number;
  shippingAddress?: unknown;
  billingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  customerEmail?: string;
  email?: string;
  customerName?: string;
  fullname?: string;
};

export const createUser = async (req: CreateUserRequest, res: JsonResponse) => {
  try {
    const { username, email, password, isAdmin, firstname, lastname } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstname: firstname || username || "User",
        lastname: lastname || "Account",
        role: isAdmin ? "ADMIN" : "USER",
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updatePasswords = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { password: { not: null } },
      select: { id: true, password: true },
    });

    for (const user of users) {
      const current = user.password ?? "";
      if (current.startsWith("$2a$") || current.startsWith("$2b$") || current.startsWith("$2y$")) {
        continue;
      }
      const hashedPassword = await bcryptjs.hash(current, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    console.log("Passwords updated successfully");
  } catch (error) {
    console.error("Error updating passwords:", error);
  }
};

export const addProduct = async (formData: FormData) => {
  const { name, slug, description, category, origin, healthBenefit, culinaryUses, price, stock } =
    Object.fromEntries(formData);

  try {
    const imageUrl = await uploadImageToCloudinary(formData.get("images") as File | null);
    const categoryItems = splitList(category);
    const healthItems = splitList(healthBenefit);
    const culinaryItems = splitList(culinaryUses);

    const categoryConnectOrCreate = categoryItems.map((title) => ({
      where: { slug: slugify(title) },
      create: { title, slug: slugify(title), stock: Number(stock ?? 0) || 0 },
    }));

    await prisma.product.create({
      data: {
        name: String(name ?? ""),
        slug: String(slug ?? ""),
        description: String(description ?? ""),
        origin: String(origin ?? ""),
        price: Number(price ?? 0),
        stock: Number(stock ?? 0),
        categories: {
          connectOrCreate: categoryConnectOrCreate,
        },
        healthBenefits: {
          create: healthItems.map((benefit) => ({ benefit })),
        },
        culinaryUses: {
          create: culinaryItems.map((use) => ({ use })),
        },
        ...(imageUrl
          ? {
              images: {
                create: [{ url: imageUrl }],
              },
            }
          : {}),
      },
    });

    revalidatePath("/shop-spices");
    return JSON.stringify({ success: true });
  } catch (error) {
    console.error(`Error adding new product: ${error}`);
    return { error: "An error occurred while adding a new product" };
  }
};

export const addRecipe = async (formData: FormData) => {
  // Maintains old behavior: this action was previously creating a Product.
  return addProduct(formData);
};

const normalizePaymentMethod = (value: string | undefined) => {
  const normalized = (value ?? "").toUpperCase().replace(/\s+/g, "_");
  if (normalized === "CARD" || normalized === "CREDIT_CARD") return "CREDIT_CARD";
  if (normalized === "DEBIT_CARD") return "DEBIT_CARD";
  if (normalized === "PAYPAL") return "PAYPAL";
  if (normalized === "BANK_TRANSFER") return "BANK_TRANSFER";
  if (normalized === "CASH_ON_DELIVERY") return "CASH_ON_DELIVERY";
  return "CREDIT_CARD";
};

const normalizePaymentStatus = (value: string | undefined) => {
  const normalized = (value ?? "").toUpperCase();
  if (normalized === "COMPLETED" || normalized === "PAID") return "COMPLETED";
  if (normalized === "FAILED") return "FAILED";
  if (normalized === "REFUNDED") return "REFUNDED";
  return "PENDING";
};

const normalizeOrderStatus = (value: string | undefined) => {
  const normalized = (value ?? "").toUpperCase();
  if (normalized === "PROCESSING") return "PROCESSING";
  if (normalized === "SHIPPED") return "SHIPPED";
  if (normalized === "DELIVERED") return "DELIVERED";
  if (normalized === "CANCELLED") return "CANCELLED";
  if (normalized === "REFUNDED") return "REFUNDED";
  return "PENDING";
};

export async function addOrder(orderData: OrderInput) {
  try {
    const customerEmail = String(orderData.customerEmail || orderData.email || "").trim();
    const customerName = String(orderData.customerName || orderData.fullname || "Customer").trim();

    let user = customerEmail
      ? await prisma.user.findUnique({ where: { email: customerEmail }, select: { id: true } })
      : null;

    if (!user) {
      const usernameBase = slugify(customerName || "customer") || "customer";
      const randomSuffix = Math.floor(Math.random() * 100000);
      user = await prisma.user.create({
        data: {
          username: `${usernameBase}-${randomSuffix}`,
          firstname: customerName.split(" ")[0] || "Customer",
          lastname: customerName.split(" ").slice(1).join(" ") || "User",
          email: customerEmail || `${usernameBase}-${randomSuffix}@guest.local`,
          role: "USER",
        },
        select: { id: true },
      });
    }

    const itemsInput = Array.isArray(orderData.items) ? orderData.items : [];
    const resolvedItems = [];

    for (const item of itemsInput) {
      const quantity = Number(item.quantity ?? 1);
      const unitPrice = Number(item.price ?? 0);

      let variantId: string | null = item.productVariantId ?? null;
      if (!variantId && item.productId) {
        const variant = await prisma.productVariant.findFirst({
          where: { productId: String(item.productId) },
          select: { id: true },
        });
        variantId = variant?.id ?? null;
      }

      if (!variantId) {
        continue;
      }

      resolvedItems.push({
        productVariantId: variantId,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      });
    }

    if (!resolvedItems.length) {
      throw new Error("No valid order items with product variants were provided.");
    }

    const shippingAddress =
      typeof orderData.shippingAddress === "string"
        ? orderData.shippingAddress
        : JSON.stringify(orderData.shippingAddress ?? {});

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: Number(orderData.totalAmount ?? 0),
        shippingAddress,
        billingAddress: orderData.billingAddress
          ? String(orderData.billingAddress)
          : null,
        paymentMethod: normalizePaymentMethod(orderData.paymentMethod),
        paymentStatus: normalizePaymentStatus(orderData.paymentStatus),
        status: normalizeOrderStatus(orderData.orderStatus),
        items: {
          create: resolvedItems,
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/orders");

    return {
      success: true,
      message: "Order created successfully",
      order,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    console.error("Error adding order:", error);
    return { success: false, message };
  }
}

export async function addContact(formData: FormData) {
  const { firstname, lastname, email, contact, message } = Object.fromEntries(formData);

  try {
    await prisma.contact.create({
      data: {
        firstname: String(firstname ?? ""),
        lastname: String(lastname ?? ""),
        email: String(email ?? ""),
        contact: String(contact ?? ""),
        message: String(message ?? ""),
      },
    });
    revalidatePath("/contact");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add contact";
    return { success: false, message };
  }
}
