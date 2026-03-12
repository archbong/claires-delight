import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from 'bcrypt'

const connectionString = process.env.DATABASE_URL;
const spiceImage = process.env.IMAGE_PATH || "/image/spices";
const recipeImage = process.env.IMAGE_PATH || "/image/recipes";
const blogImage = process.env.IMAGE_PATH || "/image/blogs";


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
  const groundGarlic = await prisma.product.create({
    data: {
      name: "Ground Garlic",
      slug: "ground-garlic",
      description:
        "Finely milled premium garlic powder made from carefully dried garlic cloves. A pantry essential for enhancing flavor in soups, stews, sauces, marinades, and grilled dishes across Nigerian and international cuisines.",
      origin: "Kaduna, Nigeria",
      price: 10000.99,
      stock: 250,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Supports heart health" },
          { benefit: "Boosts immune system" },
          { benefit: "Rich in antioxidants" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Seasoning for soups and stews" },
          { use: "Marinades for grilled meats" },
          { use: "Flavoring rice dishes and sauces" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/garlic-powder.png`,
            altText: "Ground Garlic",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "GAR-100G", price: 9.99, stock: 150 },
          { name: "250g Pack", sku: "GAR-250G", price: 18.99, stock: 100 },
        ],
      },
    },
  });

  const groundGinger = await prisma.product.create({
    data: {
      name: "Ground Ginger",
      slug: "ground-ginger",
      description:
        "Aromatic ground ginger made from carefully dried ginger roots. Known for its warm, spicy flavor, it enhances traditional Nigerian soups, teas, baked goods, and marinades.",
      origin: "Nasarawa, Nigeria",
      price: 15000.99,
      stock: 220,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Aids digestion" },
          { benefit: "Relieves nausea" },
          { benefit: "Anti-inflammatory properties" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Spicing up soups and stews" },
          { use: "Ginger tea and beverages" },
          { use: "Baking and desserts" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-ginger.png`,
            altText: "Premium Ground Ginger",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "GIN-100G", price: 10.99, stock: 150 },
          { name: "250g Pack", sku: "GIN-250G", price: 19.99, stock: 70 },
        ],
      },
    },
  });

  const groundTurmeric = await prisma.product.create({
    data: {
      name: "Premium Ground Turmeric",
      slug: "premium-ground-turmeric",
      description:
        "Vibrant golden turmeric powder with a warm earthy flavor. A key ingredient in curry blends and healthy recipes, prized for its natural color and powerful wellness benefits.",
      origin: "Ogun, Nigeria",
      price: 12000.99,
      stock: 210,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Powerful anti-inflammatory properties" },
          { benefit: "Supports immune health" },
          { benefit: "Rich in antioxidants" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Curries and rice dishes" },
          { use: "Healthy smoothies and drinks" },
          { use: "Seasoning soups and sauces" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-turmeric.png`,
            altText: "Premium Ground Turmeric",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "TUR-100G", price: 11.99, stock: 140 },
          { name: "250g Pack", sku: "TUR-250G", price: 21.99, stock: 70 },
        ],
      },
    },
  });

  const groundNutmeg = await prisma.product.create({
    data: {
      name: "Ground Nutmeg",
      slug: "ground-nutmeg",
      description:
        "Warm, sweet, and aromatic nutmeg powder made from finely ground nutmeg seeds. Perfect for desserts, beverages, and savory dishes.",
      origin: "Calabar, Nigeria",
      price: 20000.99,
      stock: 180,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Supports digestion" },
          { benefit: "Promotes relaxation and sleep" },
          { benefit: "Contains antioxidants" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Baked goods and desserts" },
          { use: "Custards and creamy sauces" },
          { use: "Hot drinks and teas" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-nutmeg.png`,
            altText: "Premium Ground Nutmeg",
          },
        ],
      },
      variants: {
        create: [
          { name: "80g Jar", sku: "NUT-080G", price: 13.99, stock: 100 },
          { name: "200g Pack", sku: "NUT-200G", price: 24.99, stock: 80 },
        ],
      },
    },
  });

  const groundBlackPepper = await prisma.product.create({
    data: {
      name: "Ground Black Pepper",
      slug: "ground-black-pepper",
      description:
        "Bold and aromatic black pepper made from freshly ground peppercorns. A universal spice used to enhance the flavor of meats, soups, sauces, and vegetables.",
      origin: "Cross River, Nigeria",
      price: 10000.99,
      stock: 240,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Improves digestion" },
          { benefit: "Rich in antioxidants" },
          { benefit: "Enhances nutrient absorption" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Seasoning meats and poultry" },
          { use: "Flavoring soups and sauces" },
          { use: "Table seasoning for finished dishes" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/black-pepper.png`,
            altText: "Premium Ground Black Pepper",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "BPEP-100G", price: 10.99, stock: 150 },
          { name: "250g Pack", sku: "BPEP-250G", price: 19.99, stock: 90 },
        ],
      },
    },
  });

  const groundCinnamon = await prisma.product.create({
    data: {
      name: "Ground Cinnamon",
      slug: "ground-cinnamon",
      description:
        "Sweet and fragrant cinnamon powder made from finely ground cinnamon bark. Ideal for baking, beverages, and savory dishes.",
      origin: "Sri Lanka",
      price: 11000.99,
      stock: 170,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Helps regulate blood sugar levels" },
          { benefit: "High in antioxidants" },
          { benefit: "Supports heart health" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Baked goods and pastries" },
          { use: "Hot drinks and teas" },
          { use: "Flavoring stews and rice dishes" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-cinnamon.png`,
            altText: "Premium Ground Cinnamon",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "CIN-100G", price: 12.99, stock: 100 },
          { name: "250g Pack", sku: "CIN-250G", price: 22.99, stock: 70 },
        ],
      },
    },
  });


  const groundWhitePepper = await prisma.product.create({
    data: {
      name: "Ground White Pepper",
      slug: "ground-white-pepper",
      description:
        "Smooth and earthy white pepper powder made from carefully processed pepper berries. Offers a milder heat compared to black pepper while maintaining rich flavor.",
      origin: "Vietnam",
      price: 10000.99,
      stock: 160,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Supports digestion" },
          { benefit: "Boosts metabolism" },
          { benefit: "Contains antibacterial properties" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Cream sauces and soups" },
          { use: "Seafood dishes" },
          { use: "Light-colored sauces and gravies" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-white-pepper.png`,
            altText: "Premium Ground White Pepper",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "WPEP-100G", price: 11.99, stock: 90 },
          { name: "250g Pack", sku: "WPEP-250G", price: 21.99, stock: 70 },
        ],
      },
    },
  });

  const cayennePepper = await prisma.product.create({
    data: {
      name: "Ground Cayenne Pepper",
      slug: "ground-cayenne-pepper",
      description:
        "Fiery hot cayenne pepper powder made from dried red chili peppers. Adds bold heat and vibrant color to a wide variety of dishes.",
      origin: "Kano, Nigeria",
      price: 11000.99,
      stock: 260,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Boosts metabolism" },
          { benefit: "Improves circulation" },
          { benefit: "Supports weight management" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Spicing grilled meats and seafood" },
          { use: "Pepper sauces and marinades" },
          { use: "Stews and soups" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/ground-cayenne-pepper.png`,
            altText: "Premium Ground Cayenne Pepper",
          },
        ],
      },
      variants: {
        create: [
          { name: "100g Jar", sku: "CAY-100G", price: 9.99, stock: 160 },
          { name: "250g Pack", sku: "CAY-250G", price: 17.99, stock: 100 },
        ],
      },
    },
  });

  const allPurposeSpice = await prisma.product.create({
    data: {
      name: "All Purpose Spice Blend",
      slug: "all-purpose-spice-blend",
      description:
        "A balanced blend of premium spices designed to enhance the flavor of everyday meals. Perfect for meats, vegetables, rice dishes, and soups.",
      origin: "Nigeria",
      price: 10000.99,
      stock: 200,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Rich in natural antioxidants" },
          { benefit: "Supports digestion" },
          { benefit: "Enhances flavor with natural spices" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Seasoning meats and poultry" },
          { use: "Flavoring rice and pasta dishes" },
          { use: "Vegetable stir fries" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/all-purpose-spice.png`,
            altText: "All Purpose Spice Blend",
          },
        ],
      },
      variants: {
        create: [
          { name: "150g Jar", sku: "APS-150G", price: 14.99, stock: 120 },
          { name: "400g Pack", sku: "APS-400G", price: 26.99, stock: 80 },
        ],
      },
    },
  });

  const suyaMix = await prisma.product.create({
    data: {
      name: "Authentic Suya Spice Mix",
      slug: "authentic-suya-spice-mix",
      description:
        "Traditional Nigerian suya spice blend made with roasted peanuts, chili, ginger, and aromatic spices. Perfect for recreating the iconic street food flavor at home.",
      origin: "Northern Nigeria",
      price: 11000.99,
      stock: 230,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Rich in plant proteins from peanuts" },
          { benefit: "Boosts metabolism with chili peppers" },
          { benefit: "Contains natural antioxidants" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Suya grilled beef and chicken" },
          { use: "Spicy roasted vegetables" },
          { use: "BBQ seasoning rub" },
        ],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
            altText: "Authentic Suya Spice Mix",
          },
        ],
      },
      variants: {
        create: [
          { name: "150g Jar", sku: "SUYA-150G", price: 15.99, stock: 150 },
          { name: "400g Pack", sku: "SUYA-400G", price: 27.99, stock: 80 },
        ],
      },
    },
  });

  const curryPowder = await prisma.product.create({
    data: {
      name: "Nigerian Curry Powder",
      slug: "nigerian-curry-powder",
      description:
        "A fragrant blend of turmeric, coriander, cumin, and other spices used widely in Nigerian cooking. Adds vibrant color and flavor to rice, stews, and sauces.",
      origin: "Nigeria",
      price: 10000.99,
      stock: 220,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Anti-inflammatory properties" },
          { benefit: "Supports digestion" },
          { benefit: "Rich in antioxidants" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Chicken curry dishes" },
          { use: "Rice and vegetable dishes" },
          { use: "Flavoring stews and sauces" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/curry-powder.png`,
            altText: "Nigerian Curry Powder",
          },
        ],
      },
      variants: {
        create: [
          { name: "150g Jar", sku: "CUR-150G", price: 12.99, stock: 140 },
          { name: "400g Pack", sku: "CUR-400G", price: 23.99, stock: 80 },
        ],
      },
    },
  });

  const jollofSpice = await prisma.product.create({
    data: {
      name: "Jollof Rice Signature Spice",
      slug: "jollof-rice-signature-spice",
      description:
        "A specially crafted spice blend designed to deliver the authentic taste of Nigerian jollof rice. Combines smoky peppers, herbs, and spices for rich flavor.",
      origin: "Nigeria",
      price: 11000.99,
      stock: 260,
      categories: {
        connect: [{ id: spicesCategory.id }],
      },
      healthBenefits: {
        create: [
          { benefit: "Rich in natural antioxidants" },
          { benefit: "Supports digestion" },
          { benefit: "Enhances flavor naturally without additives" },
        ],
      },
      culinaryUses: {
        create: [
          { use: "Traditional Nigerian jollof rice" },
          { use: "Fried rice seasoning" },
          { use: "Grilled chicken and seafood marinades" },
        ],
      },
      images: {
        create: [
          {
            url: `${spiceImage}/jellof-rice-spice.png`,
            altText: "Jollof Rice Signature Spice",
          },
        ],
      },
      variants: {
        create: [
          { name: "150g Jar", sku: "JOL-150G", price: 14.99, stock: 180 },
          { name: "400g Pack", sku: "JOL-400G", price: 26.99, stock: 80 },
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
        productId: groundBlackPepper.id,
        userId: customerUser.id,
      },
      {
        name: "Michael Chen",
        description:
          "Best turmeric I've ever used. The color is vibrant and the flavor is authentic.",
        rating: 4,
        productId: groundTurmeric.id,
      },
      {
        name: "Emma Wilson",
        description:
          "Ceylon cinnamon makes the best chai tea! So much better than regular cinnamon.",
        rating: 5,
        productId: groundCinnamon.id,
      },
      {
        name: "David Brown",
        description:
          "All-Purpose premium quality spices. The saffron transformed my paella dish!",
        rating: 5,
        productId: allPurposeSpice.id,
      },
    ],
  });
  console.log("✅ Reviews created");

  // Create Recipes
  console.log("🍳 Creating recipes...");
  const jollofRiceRecipe = await prisma.recipe.create({
    data: {
      title: "Classic Nigerian Jollof Rice",
      slug: "classic-nigerian-jollof-rice",
      description:
        "A smoky and flavorful Nigerian jollof rice cooked in a rich tomato pepper sauce and seasoned with signature jollof spice.",
      image: `${recipeImage}/chicken-soup.png`,
      cookingTime: 60,
      difficulty: "MEDIUM",
      servings: 6,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 420,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Long grain parboiled rice - 3 cups" },
          { name: "Tomato paste - 3 tbsp" },
          { name: "Blended tomatoes and peppers - 2 cups" },
          { name: "Chicken stock - 2 cups" },
          { name: "Jollof rice spice - 2 tbsp" },
          { name: "Onions - 1 large" },
          { name: "Vegetable oil - 1/2 cup" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Heat oil and sauté onions", order: 1 },
          { step: "Add tomato paste and fry for 5 minutes", order: 2 },
          { step: "Pour blended tomato mixture and cook sauce", order: 3 },
          { step: "Add stock, spices, and rice", order: 4 },
          { step: "Cook on low heat until rice is tender", order: 5 },
        ],
      },
      tags: {
        create: [
          { tag: "Jollof Rice" },
          { tag: "Rice Dish" },
          { tag: "Party Food" },
        ],
      },
      spices: {
        create: [
          { spice: "Jollof Spice" },
          { spice: "Curry Powder" },
          { spice: "Black Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const chickenCurryRecipe = await prisma.recipe.create({
    data: {
      title: "Nigerian Chicken Curry",
      slug: "nigerian-chicken-curry",
      description:
        "Tender chicken simmered in a fragrant curry sauce made with vegetables and Nigerian curry powder.",
      image: `${recipeImage}/easy-chicken-curry.png`,
      cookingTime: 50,
      difficulty: "EASY",
      servings: 4,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 380,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Chicken pieces - 800g" },
          { name: "Potatoes - 2 medium" },
          { name: "Carrots - 2 medium" },
          { name: "Curry powder - 2 tbsp" },
          { name: "Garlic powder - 1 tsp" },
          { name: "Onions - 1 large" },
          { name: "Chicken stock - 2 cups" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Season and brown chicken pieces", order: 1 },
          { step: "Add onions and sauté", order: 2 },
          { step: "Add curry powder and spices", order: 3 },
          { step: "Pour in stock and simmer", order: 4 },
          { step: "Add vegetables and cook until tender", order: 5 },
        ],
      },
      tags: {
        create: [{ tag: "Chicken" }, { tag: "Curry" }],
      },
      spices: {
        create: [
          { spice: "Curry Powder" },
          { spice: "Garlic Powder" },
          { spice: "Ginger" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const suyaRecipe = await prisma.recipe.create({
    data: {
      title: "Authentic Nigerian Beef Suya",
      slug: "authentic-nigerian-beef-suya",
      description:
        "Spicy grilled beef skewers coated in traditional suya spice mix, a beloved Nigerian street food.",
      image: `${recipeImage}/beef-suya.png`,
      cookingTime: 40,
      difficulty: "EASY",
      servings: 4,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 500,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Beef strips - 800g" },
          { name: "Suya spice mix - 3 tbsp" },
          { name: "Ground cayenne pepper - 1 tsp" },
          { name: "Vegetable oil - 2 tbsp" },
          { name: "Onions (sliced) - 1 large" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Slice beef into thin strips", order: 1 },
          { step: "Coat with oil and suya spice", order: 2 },
          { step: "Thread onto skewers", order: 3 },
          { step: "Grill until cooked and slightly charred", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Suya" }, { tag: "Street Food" }],
      },
      spices: {
        create: [
          { spice: "Suya Mix" },
          { spice: "Cayenne Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const friedRiceRecipe = await prisma.recipe.create({
    data: {
      title: "Nigerian Fried Rice",
      slug: "nigerian-fried-rice",
      description:
        "Flavorful Nigerian fried rice cooked with vegetables, chicken, and aromatic spices for a colorful and delicious meal.",
      image: `${recipeImage}/fried-rice.png`,
      cookingTime: 45,
      difficulty: "MEDIUM",
      servings: 5,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 410,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Parboiled rice - 3 cups" },
          { name: "Mixed vegetables (carrots, peas, corn) - 2 cups" },
          { name: "Cooked chicken pieces - 2 cups" },
          { name: "Soy sauce - 2 tbsp" },
          { name: "Garlic powder - 1 tsp" },
          { name: "Curry powder - 1 tbsp" },
          { name: "Vegetable oil - 4 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Cook rice in seasoned stock and set aside", order: 1 },
          { step: "Heat oil and sauté garlic and onions", order: 2 },
          { step: "Add vegetables and stir fry briefly", order: 3 },
          { step: "Add cooked rice and soy sauce", order: 4 },
          { step: "Stir fry until well combined and heated through", order: 5 },
        ],
      },
      tags: {
        create: [{ tag: "Fried Rice" }, { tag: "Party Food" }],
      },
      spices: {
        create: [
          { spice: "Garlic Powder" },
          { spice: "Curry Powder" },
          { spice: "Black Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "DAIRY_FREE" }],
      },
    },
  });

  const pepperChickenRecipe = await prisma.recipe.create({
    data: {
      title: "Nigerian Pepper Chicken",
      slug: "nigerian-pepper-chicken",
      description:
        "Spicy and flavorful chicken cooked in a rich pepper sauce, perfect as a main dish or party appetizer.",
      image: `${recipeImage}/pepper-chicken.png`,
      cookingTime: 50,
      difficulty: "MEDIUM",
      servings: 4,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 430,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Chicken pieces - 1kg" },
          { name: "Blended red peppers - 1 cup" },
          { name: "Ground cayenne pepper - 1 tsp" },
          { name: "Garlic powder - 1 tsp" },
          { name: "Onions - 1 large" },
          { name: "Vegetable oil - 3 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Season chicken and boil until tender", order: 1 },
          { step: "Heat oil and sauté onions", order: 2 },
          { step: "Add pepper blend and cook sauce", order: 3 },
          { step: "Add chicken and simmer in sauce", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Chicken" }, { tag: "Spicy" }],
      },
      spices: {
        create: [
          { spice: "Cayenne Pepper" },
          { spice: "Garlic Powder" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const coconutRiceRecipe = await prisma.recipe.create({
    data: {
      title: "Nigerian Coconut Rice",
      slug: "nigerian-coconut-rice",
      description:
        "Creamy coconut rice cooked in rich coconut milk with spices for a delicious tropical flavor.",
      image: `${recipeImage}/coconut-rice.png`,
      cookingTime: 40,
      difficulty: "EASY",
      servings: 5,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 390,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Long grain rice - 3 cups" },
          { name: "Coconut milk - 2 cups" },
          { name: "Chicken stock - 1 cup" },
          { name: "Onions - 1 large" },
          { name: "Ground ginger - 1 tsp" },
          { name: "Garlic powder - 1 tsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Heat oil and sauté onions", order: 1 },
          { step: "Add rice and toast lightly", order: 2 },
          { step: "Add coconut milk and stock", order: 3 },
          { step: "Season with spices and simmer", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Rice Dish" }, { tag: "Coconut" }],
      },
      spices: {
        create: [
          { spice: "Ginger" },
          { spice: "Garlic" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "DAIRY_FREE" }],
      },
    },
  });

  const grilledFishRecipe = await prisma.recipe.create({
    data: {
      title: "Spicy Grilled Fish",
      slug: "spicy-grilled-fish",
      description:
        "Whole grilled fish marinated in spicy Nigerian seasoning and grilled to smoky perfection.",
      image: `${recipeImage}/grilled-fish.png`,
      cookingTime: 35,
      difficulty: "EASY",
      servings: 3,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 350,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Whole tilapia fish - 2 large" },
          { name: "Suya spice mix - 2 tbsp" },
          { name: "Ground black pepper - 1 tsp" },
          { name: "Vegetable oil - 2 tbsp" },
          { name: "Lemon juice - 2 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Clean and score fish", order: 1 },
          { step: "Rub fish with spices and oil", order: 2 },
          { step: "Marinate for 30 minutes", order: 3 },
          { step: "Grill until cooked through", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Seafood" }, { tag: "Grilled" }],
      },
      spices: {
        create: [
          { spice: "Suya Mix" },
          { spice: "Black Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const beefStewRecipe = await prisma.recipe.create({
    data: {
      title: "Nigerian Beef Stew",
      slug: "nigerian-beef-stew",
      description:
        "Rich tomato-based stew with tender beef pieces, perfect for serving with rice, yam, or bread.",
      image: `${recipeImage}/yam-sauce.png`,
      cookingTime: 60,
      difficulty: "MEDIUM",
      servings: 6,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 420,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Beef chunks - 1kg" },
          { name: "Tomato blend - 2 cups" },
          { name: "Tomato paste - 2 tbsp" },
          { name: "Onions - 2 large" },
          { name: "Ground black pepper - 1 tsp" },
          { name: "Vegetable oil - 1/2 cup" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Season and boil beef until tender", order: 1 },
          { step: "Fry tomato paste in oil", order: 2 },
          { step: "Add tomato blend and cook sauce", order: 3 },
          { step: "Add beef and simmer", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Beef" }, { tag: "Stew" }],
      },
      spices: {
        create: [
          { spice: "Black Pepper" },
          { spice: "Garlic Powder" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const roastedChickenRecipe = await prisma.recipe.create({
    data: {
      title: "Spiced Roasted Chicken",
      slug: "spiced-roasted-chicken",
      description:
        "Juicy roasted chicken coated with aromatic spices and herbs for a crispy and flavorful dish.",
      image: `${recipeImage}/roasted-chicken.png`,
      cookingTime: 75,
      difficulty: "MEDIUM",
      servings: 5,
      cuisine: "International",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 470,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Whole chicken - 1.5kg" },
          { name: "All purpose spice - 2 tbsp" },
          { name: "Ground garlic - 1 tsp" },
          { name: "Ground black pepper - 1 tsp" },
          { name: "Olive oil - 3 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Preheat oven to 200°C", order: 1 },
          { step: "Rub chicken with oil and spices", order: 2 },
          { step: "Place chicken in roasting pan", order: 3 },
          { step: "Roast until golden and cooked through", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Roasted" }, { tag: "Chicken" }],
      },
      spices: {
        create: [
          { spice: "All Purpose Spice" },
          { spice: "Black Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const vegetableCurryRiceRecipe = await prisma.recipe.create({
    data: {
      title: "Vegetable Curry Rice",
      slug: "vegetable-curry-rice",
      description:
        "A colorful vegetarian rice dish cooked with vegetables and aromatic curry spices.",
      image: `${recipeImage}/vegetable-soup.png`,
      cookingTime: 35,
      difficulty: "EASY",
      servings: 4,
      cuisine: "Fusion",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 320,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Rice - 2 cups" },
          { name: "Mixed vegetables - 2 cups" },
          { name: "Curry powder - 1 tbsp" },
          { name: "Garlic powder - 1 tsp" },
          { name: "Vegetable oil - 2 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Cook rice until tender", order: 1 },
          { step: "Sauté vegetables in oil", order: 2 },
          { step: "Add curry powder and spices", order: 3 },
          { step: "Mix rice and cook briefly", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Vegetarian" }, { tag: "Rice" }],
      },
      spices: {
        create: [
          { spice: "Curry Powder" },
          { spice: "Garlic Powder" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "VEGETARIAN" }],
      },
    },
  });

  const pepperSoupRecipe = await prisma.recipe.create({
    data: {
      title: "Spicy Nigerian Pepper Soup",
      slug: "spicy-nigerian-pepper-soup",
      description:
        "Hot and aromatic pepper soup made with meat and traditional spices, perfect for cold evenings.",
      image: `${recipeImage}/salad.png`,
      cookingTime: 50,
      difficulty: "MEDIUM",
      servings: 5,
      cuisine: "Nigerian",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      calories: 300,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Goat meat - 800g" },
          { name: "Pepper soup spice - 2 tbsp" },
          { name: "Ground cayenne pepper - 1 tsp" },
          { name: "Onions - 1 large" },
          { name: "Water - 4 cups" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Season and boil meat", order: 1 },
          { step: "Add pepper soup spices", order: 2 },
          { step: "Simmer until meat is tender", order: 3 },
        ],
      },
      tags: {
        create: [{ tag: "Soup" }, { tag: "Spicy" }],
      },
      spices: {
        create: [
          { spice: "Cayenne Pepper" },
          { spice: "Black Pepper" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "GLUTEN_FREE" }],
      },
    },
  });

  const gingerGarlicStirFryRecipe = await prisma.recipe.create({
    data: {
      title: "Ginger Garlic Stir Fry",
      slug: "ginger-garlic-stir-fry",
      description:
        "Quick stir fry packed with vegetables and bold ginger garlic flavor.",
      image: `${recipeImage}/goat-meat-pepper-soup.png`,
      cookingTime: 20,
      difficulty: "EASY",
      servings: 3,
      cuisine: "Asian Fusion",
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: false,
      calories: 260,
      authorId: staffUser.id,
      ingredients: {
        create: [
          { name: "Mixed vegetables - 3 cups" },
          { name: "Ground ginger - 1 tsp" },
          { name: "Ground garlic - 1 tsp" },
          { name: "Soy sauce - 2 tbsp" },
          { name: "Sesame oil - 1 tbsp" },
        ],
      },
      methodSteps: {
        create: [
          { step: "Heat oil in wok", order: 1 },
          { step: "Add garlic and ginger", order: 2 },
          { step: "Stir fry vegetables quickly", order: 3 },
          { step: "Add soy sauce and toss well", order: 4 },
        ],
      },
      tags: {
        create: [{ tag: "Stir Fry" }, { tag: "Vegetarian" }],
      },
      spices: {
        create: [
          { spice: "Ginger" },
          { spice: "Garlic" },
        ],
      },
      dietaryRestrictions: {
        create: [{ restriction: "VEGAN" }],
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
      <h2>Introduction to Saffron: The World's Most Precious Spice</h2>
      <p>Saffron is often referred to as <strong>"red gold"</strong>, and for good reason. Harvested from the delicate Crocus sativus flower, each thread of saffron is hand-picked with extraordinary care. It takes over <strong>75,000 flowers to produce just one pound of saffron</strong>, making it the most expensive spice in the world.</p>

      <p>But saffron’s true value lies not only in its rarity but in the <strong>luxurious aroma, vibrant golden color, and complex flavor</strong> it brings to dishes.</p>

      <h2>How to Properly Use Saffron</h2>
      <p>To unlock saffron’s full potential, proper preparation is essential.</p>

      <ul>
        <li><strong>Bloom the threads:</strong> Soak saffron in warm water, milk, or broth for 10–15 minutes before adding to dishes.</li>
        <li><strong>Grind gently:</strong> Crushing the threads using a mortar and pestle intensifies the flavor.</li>
        <li><strong>Use sparingly:</strong> A few strands can transform an entire dish.</li>
      </ul>

      <h2>Dishes That Shine with Saffron</h2>
      <p>Saffron has been cherished in cuisines around the world:</p>

      <ul>
        <li>Spanish <strong>Paella</strong></li>
        <li>Italian <strong>Risotto alla Milanese</strong></li>
        <li>Persian <strong>Jeweled Rice</strong></li>
        <li>Indian <strong>Biryani</strong></li>
      </ul>

      <h2>Final Thoughts</h2>
      <p>Using saffron is about celebrating flavor, culture, and culinary artistry. Even a small pinch can elevate your cooking from ordinary to extraordinary.</p>
    `,
      excerpt:
        "Discover why saffron is called the world's most luxurious spice and learn how to use it to elevate your cooking.",
      featuredImage:
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
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
      <h2>The Golden Spice of Wellness</h2>
      <p>Turmeric has been used for thousands of years in both traditional medicine and cooking. Its vibrant color and earthy flavor make it a staple in kitchens worldwide.</p>

      <h2>The Science Behind Turmeric</h2>
      <p>The key compound responsible for turmeric’s benefits is <strong>curcumin</strong>. Research shows that curcumin has powerful <strong>anti-inflammatory and antioxidant properties</strong>.</p>

      <h2>Health Benefits</h2>
      <ul>
        <li>Supports joint and muscle health</li>
        <li>Boosts immune system</li>
        <li>Improves digestion</li>
        <li>May support brain function</li>
      </ul>

      <h2>Ways to Add Turmeric to Your Diet</h2>
      <ul>
        <li>Add to smoothies</li>
        <li>Cook with curries and soups</li>
        <li>Make traditional golden milk</li>
      </ul>

      <p>For best absorption, combine turmeric with <strong>black pepper</strong> which enhances curcumin absorption.</p>
    `,
      excerpt:
        "Learn about turmeric's powerful health benefits and how to add this golden spice to your daily routine.",
      featuredImage:
        `${blogImage}/turmeric-benefits.png`,
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

  await prisma.post.create({
    data: {
      title: "The Ultimate Guide to Cooking with Cinnamon",
      slug: "ultimate-guide-cooking-cinnamon",
      content: `
<h2>Introduction to Cinnamon: The Ancient Spice</h2>
<p>Cinnamon has been cherished for centuries for its <strong>warm aroma and sweet-spicy flavor</strong>. Used in both sweet and savory dishes, it’s a versatile spice found in kitchens worldwide.</p>

<h2>Health Benefits of Cinnamon</h2>
<ul>
  <li>Supports healthy blood sugar levels</li>
  <li>Rich in antioxidants</li>
  <li>May support heart health</li>
</ul>

<h2>Cooking with Cinnamon</h2>
<ul>
  <li>Add to oatmeal and baked goods</li>
  <li>Infuse in teas and coffees</li>
  <li>Season roasted vegetables or meats</li>
</ul>

<h2>Final Thoughts</h2>
<p>Cinnamon is more than a spice—it’s a flavor enhancer with health benefits that make every dish memorable.</p>
`,
      excerpt: "Discover how to cook with cinnamon and enjoy its flavor, aroma, and health benefits in your daily meals.",
      featuredImage: `${blogImage}/cooking-cinnamon.png`,
      status: "PUBLISHED",
      contentType: "BLOG",
      publishedAt: new Date(),
      readTime: 7,
      authorId: sellerUser.id,
      categoryId: postCategory.id,
      tags: {
        create: [
          { tag: "Cinnamon" },
          { tag: "Cooking Tips" },
          { tag: "Health" },
          { tag: "Spice Guide" }
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "10 Easy Recipes with Cloves You Must Try",
      slug: "easy-recipes-with-cloves",
      content: `
<h2>Introduction to Cloves</h2>
<p>Cloves are known for their <strong>intense flavor and aromatic qualities</strong>. A little goes a long way in spicing up both sweet and savory dishes.</p>

<h2>Top 10 Recipes Featuring Cloves</h2>
<ol>
  <li>Spiced Apple Pie</li>
  <li>Indian Garam Masala Chicken</li>
  <li>Mulled Wine</li>
  <li>Clove-Infused Rice Pudding</li>
  <li>Moroccan Tagine</li>
</ol>

<h2>Cooking Tips</h2>
<p>Crush cloves lightly before cooking to release their natural oils for maximum flavor.</p>
`,
      excerpt: "Explore 10 delicious recipes with cloves and learn how to bring warmth and flavor to your meals.",
      featuredImage: `${blogImage}/cloves-recipes.png`,
      status: "PUBLISHED",
      contentType: "BLOG",
      publishedAt: new Date(),
      readTime: 6,
      authorId: sellerUser.id,
      categoryId: postCategory.id,
      tags: {
        create: [
          { tag: "Cloves" },
          { tag: "Recipes" },
          { tag: "Cooking Tips" },
          { tag: "Spice Guide" }
        ],
      },
    },
  })
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

  const groundGarlicVariant = await prisma.productVariant.findFirst({
    where: { productId: groundGarlic.id, name: "100g Jar" },
  });

  const groundGingerVariant = await prisma.productVariant.findFirst({
    where: { productId: groundGinger.id, name: "100g Jar" },
  });

  const groundTurmericVariant = await prisma.productVariant.findFirst({
    where: { productId: groundTurmeric.id, name: "100g Jar" },
  });

  const groundNutmegVariant = await prisma.productVariant.findFirst({
    where: { productId: groundNutmeg.id, name: "80g Jar" },
  });

  const groundBlackPepperVariant = await prisma.productVariant.findFirst({
    where: { productId: groundBlackPepper.id, name: "100g Jar" },
  });

  const groundCinnamonVariant = await prisma.productVariant.findFirst({
    where: { productId: groundCinnamon.id, name: "100g Jar" },
  });

  const groundWhitePepperVariant = await prisma.productVariant.findFirst({
    where: { productId: groundWhitePepper.id, name: "100g Jar" },
  });

  const cayennePepperVariant = await prisma.productVariant.findFirst({
    where: { productId: cayennePepper.id, name: "100g Jar" },
  });

  const allPurposeSpiceVariant = await prisma.productVariant.findFirst({
    where: { productId: allPurposeSpice.id, name: "150g Jar" },
  });

  const suyaMixVariant = await prisma.productVariant.findFirst({
    where: { productId: suyaMix.id, name: "150g Jar" },
  });

  const curryPowderVariant = await prisma.productVariant.findFirst({
    where: { productId: curryPowder.id, name: "150g Jar" },
  });

  const jollofSpiceVariant = await prisma.productVariant.findFirst({
    where: { productId: jollofSpice.id, name: "150g Jar" },
  });

  const variants = [
    groundGarlicVariant,
    groundGingerVariant,
    groundTurmericVariant,
    groundNutmegVariant,
    groundBlackPepperVariant,
    groundCinnamonVariant,
    groundWhitePepperVariant,
    cayennePepperVariant,
    allPurposeSpiceVariant,
    suyaMixVariant,
    curryPowderVariant,
    jollofSpiceVariant,
  ].filter(Boolean);

  await prisma.cartItem.createMany({
    data: variants.map((variant) => ({
      cartId: cart.id,
      productVariantId: variant!.id,
      quantity: 1,
    })),
  });

  console.log("✅ Shopping cart created");

  // Fetch counts dynamically
  const [
    usersCount,
    categoriesCount,
    productsCount,
    variantsCount,
    reviewsCount,
    recipesCount,
    postsCount,
    contactsCount,
    cartsCount,
    cartItemsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.customerReview.count(),
    prisma.recipe.count(),
    prisma.post.count(),
    prisma.contact.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
  ]);

  console.log("🎉 Database seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   • Users: ${usersCount}`);
  console.log(`   • Categories: ${categoriesCount}`);
  console.log(`   • Products: ${productsCount}`);
  console.log(`   • Product Variants: ${variantsCount}`);
  console.log(`   • Reviews: ${reviewsCount}`);
  console.log(`   • Recipes: ${recipesCount}`);
  console.log(`   • Blog Posts: ${postsCount}`);
  console.log(`   • Contact Messages: ${contactsCount}`);
  console.log(`   • Shopping Carts: ${cartsCount}`);
  console.log(`   • Cart Items: ${cartItemsCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
