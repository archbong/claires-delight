import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from 'bcrypt'

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - be careful in production!)
  console.log("🧹 Clearing existing data...");
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.customerReview.deleteMany(),
    prisma.productHealthBenefit.deleteMany(),
    prisma.productCulinaryUse.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.recipeIngredient.deleteMany(),
    prisma.recipeMethodStep.deleteMany(),
    prisma.recipeTag.deleteMany(),
    prisma.recipeSpice.deleteMany(),
    prisma.recipeDietaryRestriction.deleteMany(),
    prisma.recipe.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.postTag.deleteMany(),
    prisma.post.deleteMany(),
    prisma.postCategory.deleteMany(),
    prisma.userToken.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("✅ Existing data cleared");

  // Create Users
  console.log("👥 Creating users...");
  const hashedPassword = await hash("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      firstname: "Claire",
      lastname: "Delight",
      email: "admin@clairesdelight.com",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      role: "ADMIN",
      profile: {
        create: {
          phone: "+1234567890",
          address: "123 Admin Street",
          city: "New York",
          country: "USA",
        },
      },
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      username: "spice_master",
      firstname: "Raj",
      lastname: "Kumar",
      email: "seller@clairesdelight.com",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=seller",
      role: "SELLER",
      profile: {
        create: {
          phone: "+0987654321",
          address: "456 Spice Lane",
          city: "Mumbai",
          country: "India",
        },
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      username: "foodie_jane",
      email: "jane@example.com",
      firstname: "Jane",
      lastname: "Doe",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      role: "USER",
      profile: {
        create: {
          phone: "+1122334455",
          address: "789 Food Street",
          city: "London",
          country: "UK",
        },
      },
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      username: "chef_mike",
      firstname: "Mike",
      lastname: "Johnson",
      email: "mike@clairesdelight.com",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      role: "STAFF",
      profile: {
        create: {
          phone: "+5566778899",
          address: "101 Kitchen Road",
          city: "Paris",
          country: "France",
        },
      },
    },
  });

  console.log("✅ Users created");

  // Create Categories
  console.log("📂 Creating categories...");
  const spicesCategory = await prisma.category.create({
    data: {
      slug: "premium-spices",
      title: "Premium Spices",
      stock: 500,
    },
  });

  const herbsCategory = await prisma.category.create({
    data: {
      slug: "fresh-herbs",
      title: "Fresh Herbs",
      stock: 300,
    },
  });

  const blendsCategory = await prisma.category.create({
    data: {
      slug: "spice-blends",
      title: "Spice Blends",
      stock: 200,
    },
  });

  const teaCategory = await prisma.category.create({
    data: {
      slug: "herbal-teas",
      title: "Herbal Teas",
      stock: 150,
    },
  });

  console.log("✅ Categories created");

  // Create Products
  console.log("📦 Creating products...");
  const saffron = await prisma.product.create({
    data: {
      name: "Premium Kashmir Saffron",
      slug: "premium-kashmir-saffron",
      description:
        "World's finest saffron threads from Kashmir, known for its rich aroma and vibrant color. Hand-picked and sun-dried.",
      origin: "Kashmir, India",
      price: 89.99,
      stock: 50,
      featured: true,
      categories: {
        connect: [{ id: spicesCategory.id }, { id: blendsCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Rich in antioxidants" },
          { benefit: "Mood enhancer" },
          { benefit: "Anti-inflammatory properties" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Rice dishes like biryani and paella" },
          { use: "Desserts and sweets" },
          { use: "Tea and beverages" },
        ],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1593642532454-e138e28a63f4",
            altText: "Premium Kashmir Saffron",
          },
          {
            url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
            altText: "Saffron threads close-up",
          },
        ],
      },
      variants: {
        create: [
          {
            name: "1g Pack",
            sku: "SAF-001-1G",
            price: 89.99,
            stock: 30,
          },
          {
            name: "5g Pack",
            sku: "SAF-001-5G",
            price: 399.99,
            stock: 20,
          },
        ],
      },
    },
  });

  const turmeric = await prisma.product.create({
    data: {
      name: "Organic Turmeric Powder",
      slug: "organic-turmeric-powder",
      description:
        "100% organic turmeric powder with high curcumin content. Perfect for cooking and health benefits.",
      origin: "Madras, India",
      price: 12.99,
      stock: 200,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Anti-inflammatory" },
          { benefit: "Boosts immunity" },
          { benefit: "Supports digestion" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Curries and stews" },
          { use: "Golden milk" },
          { use: "Smoothies" },
        ],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5",
            altText: "Organic Turmeric Powder",
          },
        ],
      },
      variants: {
        create: [
          {
            name: "200g Jar",
            sku: "TUR-001-200G",
            price: 12.99,
            stock: 150,
          },
          {
            name: "500g Pack",
            sku: "TUR-001-500G",
            price: 24.99,
            stock: 50,
          },
        ],
      },
    },
  });

  const cinnamon = await prisma.product.create({
    data: {
      name: "Ceylon Cinnamon Sticks",
      slug: "ceylon-cinnamon-sticks",
      description:
        "True cinnamon from Sri Lanka, sweeter and milder than cassia cinnamon. Perfect for desserts and beverages.",
      origin: "Sri Lanka",
      price: 15.99,
      stock: 150,
      categories: {
        connect: [{ id: spicesCategory.id }, { id: teaCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Regulates blood sugar" },
          { benefit: "Rich in antioxidants" },
          { benefit: "Anti-inflammatory" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Baking and desserts" },
          { use: "Mulled wine and cider" },
          { use: "Tea and infusions" },
        ],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
            altText: "Ceylon Cinnamon Sticks",
          },
        ],
      },
      variants: {
        create: [
          {
            name: "50g Pack",
            sku: "CIN-001-50G",
            price: 15.99,
            stock: 100,
          },
          {
            name: "100g Pack",
            sku: "CIN-001-100G",
            price: 28.99,
            stock: 50,
          },
        ],
      },
    },
  });

  console.log("✅ Products created");

  // Create Customer Reviews
  console.log("⭐ Creating reviews...");
  await prisma.customerReview.createMany({
    data: [
      {
        name: "Sarah Johnson",
        description:
          "The saffron is absolutely incredible! The aroma fills the entire kitchen. Worth every penny!",
        rating: 5,
        productId: saffron.id,
        userId: customerUser.id,
      },
      {
        name: "Michael Chen",
        description:
          "Best turmeric I've ever used. The color is vibrant and the flavor is authentic.",
        rating: 4,
        productId: turmeric.id,
      },
      {
        name: "Emma Wilson",
        description:
          "Ceylon cinnamon makes the best chai tea! So much better than regular cinnamon.",
        rating: 5,
        productId: cinnamon.id,
      },
      {
        name: "David Brown",
        description:
          "Premium quality spices. The saffron transformed my paella dish!",
        rating: 5,
        productId: saffron.id,
      },
    ],
  });
  console.log("✅ Reviews created");

  // Create Recipes
  console.log("🍳 Creating recipes...");
  const biryaniRecipe = await prisma.recipe.create({
    data: {
      title: "Authentic Chicken Biryani",
      slug: "authentic-chicken-biryani",
      description:
        "Aromatic and flavorful traditional Indian biryani with tender chicken and fragrant basmati rice.",
      cookingTime: 120,
      difficulty: "MEDIUM",
      servings: 6,
      cuisine: "Indian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 450,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Basmati rice - 500g" },
          { name: "Chicken pieces - 1kg" },
          { name: "Onions, thinly sliced - 3 large" },
          { name: "Yogurt - 1 cup" },
          { name: "Ginger-garlic paste - 3 tbsp" },
          { name: "Biryani masala - 2 tbsp" },
          { name: "Saffron strands - 1 tsp" },
          { name: "Milk - 1/4 cup" },
        ],
      },
      methodSteps: {
        create: [
          {
            step: "Marinate chicken with yogurt and spices for 2 hours",
            order: 1,
          },
          { step: "Soak rice for 30 minutes and parboil", order: 2 },
          { step: "Fry onions until golden brown", order: 3 },
          { step: "Layer rice and chicken in a heavy-bottomed pot", order: 4 },
          { step: "Add saffron-infused milk on top", order: 5 },
          { step: "Cook on dum (steam) for 30 minutes", order: 6 },
        ],
      },
      tags: {
        create: [
          { tag: "Biryani" },
          { tag: "Chicken" },
          { tag: "Indian" },
          { tag: "Festive" },
        ],
      },
      spices: {
        create: [
          { spice: "Saffron" },
          { spice: "Cardamom" },
          { spice: "Cinnamon" },
          { spice: "Biryani Masala" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const turmericLatteRecipe = await prisma.recipe.create({
    data: {
      title: "Golden Turmeric Latte",
      slug: "golden-turmeric-latte",
      description:
        "Warm and comforting anti-inflammatory beverage perfect for cold days.",
      cookingTime: 10,
      difficulty: "EASY",
      servings: 2,
      cuisine: "Wellness",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isSeasonal: true,
      calories: 120,
      authorId: sellerUser.id,
      ingredients: {
        create: [
          { name: "Milk (or plant-based) - 2 cups" },
          { name: "Turmeric powder - 1 tsp" },
          { name: "Cinnamon - 1/2 tsp" },
          { name: "Ginger, grated - 1 tsp" },
          { name: "Honey or maple syrup - 1 tbsp" },
          { name: "Black pepper - pinch" },
          { name: "Coconut oil - 1 tsp" },
        ],
      },
      methodSteps: {
        create: [
          {
            step: "Heat milk in a saucepan until hot but not boiling",
            order: 1,
          },
          { step: "Whisk in all spices and ginger", order: 2 },
          { step: "Add honey and coconut oil", order: 3 },
          { step: "Blend until frothy using a blender", order: 4 },
          { step: "Serve warm", order: 5 },
        ],
      },
      tags: {
        create: [
          { tag: "Beverage" },
          { tag: "Wellness" },
          { tag: "Anti-inflammatory" },
          { tag: "Healthy" },
        ],
      },
      spices: {
        create: [
          { spice: "Turmeric" },
          { spice: "Cinnamon" },
          { spice: "Ginger" },
        ],
      },
      dietaryRestrictions: {
        create: [
          { restriction: "VEGAN" },
          { restriction: "GLUTEN_FREE" },
          { restriction: "DAIRY_FREE" },
        ],
      },
    },
  });

  console.log("✅ Recipes created");

  // Create Blog Posts
  console.log("📝 Creating blog posts...");
  const postCategory = await prisma.postCategory.create({
    data: {
      name: "Spice Guides",
      slug: "spice-guides",
    },
  });

  await prisma.post.create({
    data: {
      title: "The Ultimate Guide to Cooking with Saffron",
      slug: "ultimate-guide-cooking-saffron",
      content: `
        <h2>Introduction to Saffron</h2>
        <p>Saffron, known as "red gold," is the world's most expensive spice, and for good reason...</p>

        <h2>How to Use Saffron</h2>
        <p>1. Always soak saffron in warm liquid before use to release its color and flavor.</p>
        <p>2. Use a mortar and pestle to grind the threads if needed.</p>
        <p>3. A little goes a long way - just a few strands can flavor an entire dish.</p>

        <h2>Best Recipes with Saffron</h2>
        <p>From Spanish paella to Persian rice dishes, saffron elevates any recipe.</p>
      `,
      excerpt:
        "Learn everything about using saffron in your cooking, from selection to preparation techniques.",
      featuredImage:
        "https://images.unsplash.com/photo-1593642532454-e138e28a63f4",
      status: "PUBLISHED",
      contentType: "BLOG",
      publishedAt: new Date(),
      isFeatured: true,
      readTime: 8,
      authorId: adminUser.id,
      categoryId: postCategory.id,
      tags: {
        create: [
          { tag: "Saffron" },
          { tag: "Cooking Tips" },
          { tag: "Spice Guide" },
          { tag: "Premium Spices" },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Health Benefits of Turmeric You Need to Know",
      slug: "health-benefits-turmeric",
      content: `
        <h2>The Power of Curcumin</h2>
        <p>Turmeric's main active compound, curcumin, has powerful anti-inflammatory effects...</p>

        <h2>Daily Uses</h2>
        <p>• Add to smoothies for an immunity boost</p>
        <p>• Use in curries and soups</p>
        <p>• Make golden milk for better sleep</p>

        <h2>Scientific Backing</h2>
        <p>Numerous studies confirm turmeric's benefits for joint health, brain function, and more.</p>
      `,
      excerpt:
        "Discover the science-backed health benefits of turmeric and how to incorporate it into your daily routine.",
      featuredImage:
        "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5",
      status: "PUBLISHED",
      contentType: "BLOG",
      publishedAt: new Date(),
      readTime: 6,
      authorId: sellerUser.id,
      categoryId: postCategory.id,
      tags: {
        create: [
          { tag: "Turmeric" },
          { tag: "Health" },
          { tag: "Wellness" },
          { tag: "Anti-inflammatory" },
        ],
      },
    },
  });

  console.log("✅ Blog posts created");

  // Create Contact Messages
  console.log("📧 Creating contact messages...");
  await prisma.contact.createMany({
    data: [
      {
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        contact: "+1234567890",
        message: "I love your products! When will you restock the saffron?",
        status: "READ",
      },
      {
        firstname: "Maria",
        lastname: "Garcia",
        email: "maria@example.com",
        contact: "+0987654321",
        message: "Do you offer wholesale prices for restaurants?",
        status: "NEW",
      },
      {
        firstname: "Alex",
        lastname: "Smith",
        email: "alex@example.com",
        contact: "+1122334455",
        message: "Can you create custom spice blends for my bakery?",
        status: "REPLIED",
      },
    ],
  });
  console.log("✅ Contact messages created");

  // Create Cart for customer
  console.log("🛒 Creating shopping cart...");
  const cart = await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  const saffronVariant = await prisma.productVariant.findFirst({
    where: { productId: saffron.id, name: "1g Pack" },
  });

  const turmericVariant = await prisma.productVariant.findFirst({
    where: { productId: turmeric.id, name: "200g Jar" },
  });

  if (saffronVariant && turmericVariant) {
    await prisma.cartItem.createMany({
      data: [
        {
          cartId: cart.id,
          productVariantId: saffronVariant.id,
          quantity: 2,
        },
        {
          cartId: cart.id,
          productVariantId: turmericVariant.id,
          quantity: 1,
        },
      ],
    });
  }
  console.log("✅ Shopping cart created");

  console.log("🎉 Database seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   • Users: 4 (Admin, Seller, Customer, Staff)`);
  console.log(`   • Categories: 4`);
  console.log(`   • Products: 3 with variants`);
  console.log(`   • Reviews: 4`);
  console.log(`   • Recipes: 2`);
  console.log(`   • Blog Posts: 2`);
  console.log(`   • Contact Messages: 3`);
  console.log(`   • Shopping Cart: 1 with items`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
