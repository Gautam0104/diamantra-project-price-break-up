// ─── Product Data ───

const TYPE_ICONS = {
  Ring: "💍",
  Pendant: "📿",
  Necklace: "✨",
  Earring: "✦",
  Bracelet: "⟡",
  Bangle: "◎",
  "Nose Pin": "◆",
  "Nose Ring": "○",
  "Tie Pin": "📌",
};

let nextId = 9;

let products = [
  // ─── Silver Enamel Tie Pins (from PDF 1) ───
  {
    id: 1,
    name: "Personal Crest",
    subtitle: "Round Diamond Tie Pin",
    productCode: "CVDSMTP001",
    type: "Tie Pin",
    metal: "silver",
    isEnamel: true,
    makingCategory: "none",
    metalWeight: 6.4,
    diamondCharges: 18248.62,
    description:
      "Crafted in premium silver, this tie pin features rich enamel detailing highlighted with a lab-grown diamond. The smooth enamel surface adds colour while maintaining a refined, formal look. Designed to hold the tie securely, it remains comfortable throughout the day. Durable and well-finished, it is ideal for regular office wear. A piece that quietly reflects personal pride and individuality.",
  },
  {
    id: 2,
    name: "Mark of Self",
    subtitle: "Round Diamond Tie Pin",
    productCode: "CVDSMTP002",
    type: "Tie Pin",
    metal: "silver",
    isEnamel: true,
    makingCategory: "none",
    metalWeight: 5.71,
    diamondCharges: 9330.12,
    description:
      "This tie pin is made using polished silver, fine enamel work, and a carefully set lab-grown diamond. The enamel adds character while the diamond brings subtle elegance. Lightweight yet strong, it keeps the tie perfectly aligned. Designed for everyday use with long-lasting finish. A refined accessory that represents self-made confidence.",
  },
  // ─── Silver Bracelets (from PDF 2) ───
  {
    id: 3,
    name: "Shadow Edge Band",
    subtitle: "Round Diamond Bracelet",
    productCode: "CVDSMBR001",
    type: "Bracelet",
    metal: "silver",
    isEnamel: false,
    makingCategory: "none",
    metalWeight: 6.4,
    diamondCharges: 14553.48,
    description:
      "Crafted in premium silver, the Eclipse Band combines strength with style for the modern man. Its sleek design is accented with shimmering lab-grown diamonds, adding a subtle touch of elegance to everyday or office wear. Durable and long-lasting, this bracelet reflects your unique personality while maintaining a minimalist, contemporary appeal. Perfect for daily wear or light evening occasions.",
  },
  {
    id: 4,
    name: "Midnight Orbit Bracelet",
    subtitle: "Round & Baguette Diamond Bracelet",
    productCode: "CVDSMBR002",
    type: "Bracelet",
    metal: "silver",
    isEnamel: false,
    makingCategory: "none",
    metalWeight: 5.31,
    diamondCharges: 52518.10,
    description:
      "The Eclipse Band is a perfect blend of elegance and strength, crafted in high-quality silver. Lab-grown diamonds subtly accentuate its sleek design, making it suitable for both office and casual occasions. Its durable construction ensures long-lasting wear, reflecting your confidence and unique style. A modern accessory that tells your story effortlessly.",
  },
  // ─── Gold Enamel Pendants (from PDF 3) ───
  {
    id: 5,
    name: "Colour of My Code",
    subtitle: "Round Diamond Pendant",
    productCode: "CVDGMP001",
    type: "Pendant",
    metal: "gold",
    isEnamel: true,
    makingCategory: "gold-enamel",
    metalWeight: 1.89,
    diamondCharges: 5303.04,
    description:
      "This enamel pendant is crafted for men who live by their own principles. Made in fine gold with smooth enamel detailing that adds depth and character. The finish feels solid yet comfortable for daily wear. Available in 9KT, 14KT, and 18KT gold options to suit your preference. The design balances strength with subtle colour. A pendant that reflects the code you stand by.",
  },
  {
    id: 6,
    name: "Marked in Meaning",
    subtitle: "Round & Princess Diamond Pendant",
    productCode: "CVDGMP002",
    type: "Pendant",
    metal: "gold",
    isEnamel: true,
    makingCategory: "gold-enamel",
    metalWeight: 3.62,
    diamondCharges: 14675.65,
    description:
      "This gold enamel pendant is designed to carry personal significance. Crafted with precision, the enamel detailing adds a refined contrast to the warm gold base. Strong in build yet easy to wear throughout the day. Available in 9KT, 14KT, and 18KT gold options. The design feels modern without losing its emotional depth. A piece that holds meaning close to you.",
  },
  // ─── Gold Diamond Pendants (from PDF 4) ───
  {
    id: 7,
    name: "Strength I Carry",
    subtitle: "Round Diamond Pendant",
    productCode: "CVDGMP003",
    type: "Pendant",
    metal: "gold",
    isEnamel: false,
    makingCategory: "pure-gold",
    metalWeight: 1.42,
    diamondCharges: 5798.07,
    description:
      "This gold pendant is designed for men who draw strength from within. Crafted in premium gold with a clean and confident finish. Available in 9KT, 14KT, and 18KT gold options. Designed to feel solid yet comfortable on the neck. Easy to pair with everyday or occasion wear. A piece that reflects inner power and personal identity.",
  },
  {
    id: 8,
    name: "Mark of My Journey",
    subtitle: "Round Diamond Pendant",
    productCode: "CVDGMP004",
    type: "Pendant",
    metal: "gold",
    isEnamel: false,
    makingCategory: "pure-gold",
    metalWeight: 2.17,
    diamondCharges: 6516.13,
    description:
      "This pendant symbolises the path shaped by experience and choices. Crafted in fine gold with attention to detail and durability. Available in 9KT, 14KT, and 18KT gold choices. Designed for smooth and secure wear. Minimal yet meaningful in appearance. A reflection of the journey that defines you.",
  },
];

// Making charge rates for the two categories
const MAKING_RATE_CASE_1 = 1100; // Gold Jewellery
const MAKING_RATE_CASE_2 = 1300; // Gold Enamel Jewellery

// GST rate on jewellery
const GST_RATE = 3; // percent

// ─── Pricing Logic ───

/**
 * Calculates the pricing breakup for a gold jewellery product.
 *
 * Gold Charges    = goldRate × metalWeight
 * Making Charges  = flat rate (≤1g) or rate × weight (>1g)
 * Diamond Charges = fixed per product
 * Subtotal        = Gold + Making + Diamond
 * GST             = 3% of Subtotal
 * Total           = Subtotal + GST
 */
function calculateBreakup(diamondCharges, metalWeight, goldRate, makingRate) {
  const goldCharges = goldRate * metalWeight;
  const makingCharges =
    metalWeight <= 1 ? makingRate : makingRate * metalWeight;

  const subtotal = goldCharges + makingCharges + diamondCharges;
  const gst = subtotal * (GST_RATE / 100);
  const total = subtotal + gst;

  const round = (n) => Math.round(n * 100) / 100;

  return {
    goldCharges: round(goldCharges),
    makingCharges: round(makingCharges),
    diamondCharges: round(diamondCharges),
    subtotal: round(subtotal),
    gst: round(gst),
    total: round(total),
  };
}

/**
 * Calculates the pricing breakup for a silver jewellery product.
 * No making charges for silver.
 *
 * Silver Charges  = silverRate × metalWeight
 * Diamond Charges = fixed per product
 * Subtotal        = Silver + Diamond
 * GST             = 3% of Subtotal
 * Total           = Subtotal + GST
 */
function calculateSilverBreakup(diamondCharges, metalWeight, silverRate) {
  const silverCharges = silverRate * metalWeight;
  const subtotal = silverCharges + diamondCharges;
  const gst = subtotal * (GST_RATE / 100);
  const total = subtotal + gst;

  const round = (n) => Math.round(n * 100) / 100;

  return {
    silverCharges: round(silverCharges),
    diamondCharges: round(diamondCharges),
    subtotal: round(subtotal),
    gst: round(gst),
    total: round(total),
  };
}

/**
 * Derives diamond charges from a total product price (MRP) for gold products.
 *
 * Formula: diamondCharges = (mrp / 1.03) - goldCharges - makingCharges
 */
function deriveDiamondCharges(mrp, metalWeight, goldRate, makingRate) {
  const goldCharges = goldRate * metalWeight;
  const makingCharges =
    metalWeight <= 1 ? makingRate : makingRate * metalWeight;
  const subtotal = mrp / (1 + GST_RATE / 100);
  const diamondCharges = subtotal - goldCharges - makingCharges;
  return Math.round(diamondCharges * 100) / 100;
}

/**
 * Derives diamond charges from a total product price (MRP) for silver products.
 *
 * Formula: diamondCharges = (mrp / 1.03) - silverCharges
 */
function deriveSilverDiamondCharges(mrp, metalWeight, silverRate) {
  const silverCharges = silverRate * metalWeight;
  const subtotal = mrp / (1 + GST_RATE / 100);
  const diamondCharges = subtotal - silverCharges;
  return Math.round(diamondCharges * 100) / 100;
}

/**
 * Returns the display label for a product's metal category.
 * One of: "Gold", "Gold Enamel", "Silver", "Silver Enamel"
 */
function getMetalLabel(product) {
  if (product.metal === "silver") {
    return product.isEnamel ? "Silver Enamel" : "Silver";
  }
  return product.isEnamel ? "Gold Enamel" : "Gold";
}

/**
 * Returns the CSS modifier class for the metal badge.
 * e.g. "gold", "gold-enamel", "silver", "silver-enamel"
 */
function getMetalBadgeClass(product) {
  if (product.metal === "silver") {
    return product.isEnamel ? "silver-enamel" : "silver";
  }
  return product.isEnamel ? "gold-enamel" : "gold";
}

// ─── Formatting ───

function formatINR(num) {
  const rounded = Math.round(num);
  const str = rounded.toString();
  const isNegative = rounded < 0;
  const absStr = isNegative ? str.slice(1) : str;

  if (absStr.length <= 3) {
    return (isNegative ? "-₹" : "₹") + absStr;
  }

  const last3 = absStr.slice(-3);
  const remaining = absStr.slice(0, -3);
  const grouped = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return (isNegative ? "-₹" : "₹") + grouped + "," + last3;
}

// ─── DOM References ───

const goldRateInput = document.getElementById("goldRate");
const silverRateInput = document.getElementById("silverRate");
const productCardsContainer = document.getElementById("productCards");
const productNameEl = document.getElementById("productName");
const productSubtitleEl = document.getElementById("productSubtitle");
const productCodeEl = document.getElementById("productCode");
const productDescEl = document.getElementById("productDesc");
const productPriceEl = document.getElementById("productPrice");
const specsTableEl = document.getElementById("specsTable");
const editProductBtn = document.getElementById("editProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");
const variantsBar = document.querySelector(".variants-bar");

// Modal elements
const modalOverlay = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalSubmit = document.getElementById("modalSubmit");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const productForm = document.getElementById("productForm");

// Form fields
const fName = document.getElementById("fName");
const fSubtitle = document.getElementById("fSubtitle");
const fCode = document.getElementById("fCode");
const fType = document.getElementById("fType");
const fMetal = document.getElementById("fMetal");
const fMakingCategory = document.getElementById("fMakingCategory");
const fMetalWeight = document.getElementById("fMetalWeight");
const fTotalPrice = document.getElementById("fTotalPrice");
const fIsEnamel = document.getElementById("fIsEnamel");
const fDesc = document.getElementById("fDesc");
const fMetalWeightLabel = document.querySelector('label[for="fMetalWeight"]');

let selectedProductId = products[0].id;
let editingProductId = null;
let editingDiamondCharges = null; // stored diamond charges for live recalc in edit mode
let selectedCategory = "pure-gold"; // "pure-gold" or "gold-enamel"

// Category tab & card references
const tabPureGold = document.getElementById("tabPureGold");
const tabGoldEnamel = document.getElementById("tabGoldEnamel");
const breakupTabs = document.querySelector(".breakup-tabs");
const c1Card = document.getElementById("c1Card");
const c2Card = document.getElementById("c2Card");
const c3Card = document.getElementById("c3Card");
const c1MakingLabel = document.getElementById("c1MakingLabel");
const c2MakingLabel = document.getElementById("c2MakingLabel");

// ─── Modal ───

function openModal(mode, product) {
  if (mode === "edit" && product) {
    editingProductId = product.id;
    editingDiamondCharges = product.diamondCharges;
    modalTitle.textContent = "Edit Product";
    modalSubmit.textContent = "Save Changes";
    fName.value = product.name;
    fSubtitle.value = product.subtitle;
    fCode.value = product.productCode;
    fType.value = product.type;
    fMetal.value = product.metal || "gold";
    fMakingCategory.value = product.makingCategory || "pure-gold";
    fIsEnamel.checked = product.isEnamel || false;
    fMetalWeight.value = product.metalWeight;
    fDesc.value = product.description;

    // Update form labels and state based on metal
    updateFormForMetal(product.metal);

    // Show the current total
    if (product.metal === "silver") {
      const silverRate = parseFloat(silverRateInput.value) || 0;
      const breakup = calculateSilverBreakup(product.diamondCharges, product.metalWeight, silverRate);
      fTotalPrice.value = Math.round(breakup.total);
    } else {
      const goldRate = parseFloat(goldRateInput.value) || 0;
      const makingRate = product.makingCategory === "gold-enamel" ? MAKING_RATE_CASE_2 : MAKING_RATE_CASE_1;
      const breakup = calculateBreakup(product.diamondCharges, product.metalWeight, goldRate, makingRate);
      fTotalPrice.value = Math.round(breakup.total);
    }
  } else {
    editingProductId = null;
    editingDiamondCharges = null;
    modalTitle.textContent = "Add Product";
    modalSubmit.textContent = "Add Product";
    productForm.reset();
    fMetal.value = "gold";
    fMakingCategory.value = "pure-gold";
    fIsEnamel.checked = false;
    updateFormForMetal("gold");
  }
  modalOverlay.classList.add("modal-overlay--open");
}

function updateFormForMetal(metal) {
  if (metal === "silver") {
    fMetalWeightLabel.textContent = "Silver Weight (g)";
    fMakingCategory.value = "none";
    fMakingCategory.disabled = true;
  } else {
    fMetalWeightLabel.textContent = "Gold Weight (g)";
    fMakingCategory.disabled = false;
  }
}

function closeModal() {
  modalOverlay.classList.remove("modal-overlay--open");
  editingProductId = null;
  editingDiamondCharges = null;
}

/**
 * Recalculates the total price in the form when editing a product.
 * Keeps diamond charges fixed, updates total based on current weight/metal/category.
 */
function recalcEditTotal() {
  if (editingDiamondCharges === null) return;

  const metalWeight = parseFloat(fMetalWeight.value) || 0;
  const metal = fMetal.value;
  let total;

  if (metal === "silver") {
    const silverRate = parseFloat(silverRateInput.value) || 0;
    const breakup = calculateSilverBreakup(editingDiamondCharges, metalWeight, silverRate);
    total = breakup.total;
  } else {
    const goldRate = parseFloat(goldRateInput.value) || 0;
    const makingCategory = fMakingCategory.value;
    const makingRate = makingCategory === "gold-enamel" ? MAKING_RATE_CASE_2 : MAKING_RATE_CASE_1;
    const breakup = calculateBreakup(editingDiamondCharges, metalWeight, goldRate, makingRate);
    total = breakup.total;
  }

  fTotalPrice.value = Math.round(total);
}

// ─── CRUD ───

function addProduct(data) {
  const product = {
    id: nextId++,
    name: data.name,
    subtitle: data.subtitle,
    productCode: data.productCode,
    type: data.type,
    metal: data.metal,
    isEnamel: data.isEnamel,
    makingCategory: data.makingCategory,
    metalWeight: data.metalWeight,
    diamondCharges: data.diamondCharges,
    description: data.description,
  };
  products.push(product);
  selectedProductId = product.id;
  refreshAll();
}

function updateProduct(id, data) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  product.name = data.name;
  product.subtitle = data.subtitle;
  product.productCode = data.productCode;
  product.type = data.type;
  product.metal = data.metal;
  product.isEnamel = data.isEnamel;
  product.makingCategory = data.makingCategory;
  product.metalWeight = data.metalWeight;
  product.diamondCharges = data.diamondCharges;
  product.description = data.description;
  refreshAll();
}

function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  if (products.length === 0) {
    products.push({
      id: nextId++,
      name: "New Product",
      subtitle: "Subtitle",
      productCode: "CODE001",
      type: "Nose Pin",
      metal: "gold",
      isEnamel: false,
      makingCategory: "pure-gold",
      metalWeight: 0.5,
      diamondCharges: 2000,
      description: "",
    });
  }
  if (selectedProductId === id) {
    selectedProductId = products[0].id;
  }
  refreshAll();
}

// ─── Category Toggle ───

function switchCategory(category, skipUpdate) {
  selectedCategory = category;
  tabPureGold.classList.toggle("breakup-tab--active", category === "pure-gold");
  tabGoldEnamel.classList.toggle("breakup-tab--active", category === "gold-enamel");
  c1Card.style.display = category === "pure-gold" ? "block" : "none";
  c2Card.style.display = category === "gold-enamel" ? "block" : "none";
  if (!skipUpdate) updateBreakup();
}

// ─── Render ───

function refreshAll() {
  renderProductCards();
  updateBreakup();
}

function renderProductCards() {
  const goldRate = parseFloat(goldRateInput.value) || 0;
  const silverRate = parseFloat(silverRateInput.value) || 0;

  const cards = products
    .map((p) => {
      let breakup;
      if (p.metal === "silver") {
        breakup = calculateSilverBreakup(p.diamondCharges, p.metalWeight, silverRate);
      } else {
        const makingRate = p.makingCategory === "gold-enamel" ? MAKING_RATE_CASE_2 : MAKING_RATE_CASE_1;
        breakup = calculateBreakup(p.diamondCharges, p.metalWeight, goldRate, makingRate);
      }
      const icon = TYPE_ICONS[p.type] || "◆";
      const metalLabel = p.metal === "silver" ? "silver" : "gold";
      const badgeLabel = getMetalLabel(p);
      const badgeClass = getMetalBadgeClass(p);
      return `
    <div class="product-card ${p.id === selectedProductId ? "product-card--active" : ""}"
         data-id="${p.id}">
      <div class="product-card__image">
        <span class="product-card__metal-badge product-card__metal-badge--${badgeClass}">${badgeLabel}</span>
        <span class="product-card__image-icon">${icon}</span>
        <div class="product-card__badge">
          <div class="ribbon">${p.type}</div>
          <div class="ribbon-fold"></div>
        </div>
      </div>
      <div class="product-card__info">
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__subtitle">${p.subtitle} · ${p.metalWeight}g ${metalLabel}</div>
        <div class="product-card__price">${formatINR(breakup.total)}</div>
      </div>
    </div>
  `;
    })
    .join("");

  const addCard = `
    <div class="product-card--add" id="addProductCard">
      <div class="product-card--add__icon">+</div>
      <div class="product-card--add__label">Add Product</div>
    </div>
  `;

  productCardsContainer.innerHTML = cards + addCard;

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedProductId = parseInt(card.dataset.id, 10);
      renderProductCards();
      updateBreakup();
    });
  });

  document.getElementById("addProductCard").addEventListener("click", () => {
    openModal("add");
  });
}

function buildSpecsFromProduct(product) {
  const weightLabel = product.metal === "silver" ? "Silver Weight" : "Gold Weight";
  return {
    "Product Code": product.productCode,
    Category: product.type,
    "Metal Type": getMetalLabel(product),
    [weightLabel]: product.metalWeight + "g",
    "Diamond Charges": formatINR(product.diamondCharges),
  };
}

function renderSpecsTable(product) {
  const specs = buildSpecsFromProduct(product);
  const entries = Object.entries(specs);
  const rows = [];

  for (let i = 0; i < entries.length; i += 4) {
    const chunk = entries.slice(i, i + 4);
    const rowBg = (i / 4) % 2 === 0 ? "specs-row--white" : "specs-row--cream";

    const cells = chunk
      .map(
        ([label, value], idx) =>
          `${idx > 0 ? '<div class="specs-sep"></div>' : ""}
          <div class="specs-cell">
            <div class="specs-cell__label">${label}</div>
            <div class="specs-cell__value">${value}</div>
          </div>`
      )
      .join("");

    const remaining = 4 - chunk.length;
    let padding = "";
    for (let j = 0; j < remaining; j++) {
      padding += `<div class="specs-sep"></div><div class="specs-cell"></div>`;
    }

    rows.push(`<div class="specs-row ${rowBg}">${cells}${padding}</div>`);
  }

  specsTableEl.innerHTML = rows.join("");
}

function updateBreakup() {
  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return;

  const goldRate = parseFloat(goldRateInput.value) || 0;
  const silverRate = parseFloat(silverRateInput.value) || 0;

  // Update product detail section (common to both metals)
  productNameEl.textContent = product.name;
  productSubtitleEl.textContent = product.subtitle;
  productCodeEl.textContent = product.productCode;
  productDescEl.textContent = product.description;

  // Render specs table
  renderSpecsTable(product);

  if (product.metal === "silver") {
    // ── Silver product ──
    breakupTabs.style.display = "none";
    c1Card.style.display = "none";
    c2Card.style.display = "none";
    c3Card.style.display = "block";
    variantsBar.style.display = "none";

    const sb = calculateSilverBreakup(product.diamondCharges, product.metalWeight, silverRate);

    productPriceEl.textContent = formatINR(sb.total);

    document.getElementById("c3SilverWeight").textContent = `${product.metalWeight}g`;
    document.getElementById("c3SilverRate").textContent = `${formatINR(silverRate)}/g`;
    document.getElementById("c3SilverCharges").textContent = formatINR(sb.silverCharges);
    document.getElementById("c3DiamondCharges").textContent = formatINR(sb.diamondCharges);
    document.getElementById("c3Subtotal").textContent = formatINR(sb.subtotal);
    document.getElementById("c3GST").textContent = formatINR(sb.gst);
    document.getElementById("c3Total").textContent = formatINR(sb.total);
  } else {
    // ── Gold product ──
    breakupTabs.style.display = "flex";
    c3Card.style.display = "none";
    variantsBar.style.display = "grid";

    // Auto-select the product's native category tab
    const nativeCategory = product.makingCategory === "gold-enamel" ? "gold-enamel" : "pure-gold";
    switchCategory(nativeCategory, true);

    // Compute both cases before using either (fixes case2 reference bug)
    const case1 = calculateBreakup(product.diamondCharges, product.metalWeight, goldRate, MAKING_RATE_CASE_1);
    const case2 = calculateBreakup(product.diamondCharges, product.metalWeight, goldRate, MAKING_RATE_CASE_2);

    productPriceEl.textContent = formatINR(
      selectedCategory === "pure-gold" ? case1.total : case2.total
    );

    // Hide "Making Charge @ ₹X/g" label when weight < 1g (flat rate applies)
    c1MakingLabel.style.display = product.metalWeight < 1 ? "none" : "block";
    c2MakingLabel.style.display = product.metalWeight < 1 ? "none" : "block";

    // Case 1 card
    document.getElementById("c1GoldWeight").textContent = `${product.metalWeight}g`;
    document.getElementById("c1GoldRate").textContent = `${formatINR(goldRate)}/g`;
    document.getElementById("c1GoldCharges").textContent = formatINR(case1.goldCharges);
    document.getElementById("c1MakingCharges").textContent = formatINR(case1.makingCharges);
    document.getElementById("c1DiamondCharges").textContent = formatINR(case1.diamondCharges);
    document.getElementById("c1Subtotal").textContent = formatINR(case1.subtotal);
    document.getElementById("c1GST").textContent = formatINR(case1.gst);
    document.getElementById("c1Total").textContent = formatINR(case1.total);

    // Case 2 card
    document.getElementById("c2GoldWeight").textContent = `${product.metalWeight}g`;
    document.getElementById("c2GoldRate").textContent = `${formatINR(goldRate)}/g`;
    document.getElementById("c2GoldCharges").textContent = formatINR(case2.goldCharges);
    document.getElementById("c2MakingCharges").textContent = formatINR(case2.makingCharges);
    document.getElementById("c2DiamondCharges").textContent = formatINR(case2.diamondCharges);
    document.getElementById("c2Subtotal").textContent = formatINR(case2.subtotal);
    document.getElementById("c2GST").textContent = formatINR(case2.gst);
    document.getElementById("c2Total").textContent = formatINR(case2.total);
  }
}

// ─── Event Listeners ───

goldRateInput.addEventListener("input", refreshAll);
silverRateInput.addEventListener("input", refreshAll);

tabPureGold.addEventListener("click", () => switchCategory("pure-gold"));
tabGoldEnamel.addEventListener("click", () => switchCategory("gold-enamel"));

editProductBtn.addEventListener("click", () => {
  const product = products.find((p) => p.id === selectedProductId);
  if (product) openModal("edit", product);
});

deleteProductBtn.addEventListener("click", () => {
  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return;
  if (confirm(`Delete "${product.name}"?`)) {
    deleteProduct(product.id);
  }
});

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Metal type change in form
fMetal.addEventListener("change", () => {
  updateFormForMetal(fMetal.value);
  recalcEditTotal();
});

// Live recalc in edit mode when weight or making category changes
fMetalWeight.addEventListener("input", recalcEditTotal);
fMakingCategory.addEventListener("change", recalcEditTotal);

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const metalWeight = parseFloat(fMetalWeight.value) || 0;
  const mrp = parseFloat(fTotalPrice.value) || 0;
  const metal = fMetal.value;
  const makingCategory = metal === "silver" ? "none" : fMakingCategory.value;

  let diamondCharges;
  if (metal === "silver") {
    const silverRate = parseFloat(silverRateInput.value) || 0;
    diamondCharges = deriveSilverDiamondCharges(mrp, metalWeight, silverRate);
  } else {
    const goldRate = parseFloat(goldRateInput.value) || 0;
    const makingRate = makingCategory === "gold-enamel" ? MAKING_RATE_CASE_2 : MAKING_RATE_CASE_1;
    diamondCharges = deriveDiamondCharges(mrp, metalWeight, goldRate, makingRate);
  }

  const data = {
    name: fName.value.trim(),
    subtitle: fSubtitle.value.trim(),
    productCode: fCode.value.trim(),
    type: fType.value,
    metal: metal,
    isEnamel: fIsEnamel.checked,
    makingCategory: makingCategory,
    metalWeight: metalWeight,
    diamondCharges: diamondCharges,
    description: fDesc.value.trim(),
  };

  if (data.diamondCharges < 0) {
    const metalLabel = metal === "silver" ? "silver" : "gold";
    const proceed = confirm(
      `The entered price (${formatINR(mrp)}) is lower than ${metalLabel} + making charges alone. ` +
      `Diamond charges would be ${formatINR(data.diamondCharges)}.\n\n` +
      `Do you want to set diamond charges to ₹0 and proceed?`
    );
    if (!proceed) return;
    data.diamondCharges = 0;
  }

  if (editingProductId !== null) {
    updateProduct(editingProductId, data);
  } else {
    addProduct(data);
  }

  closeModal();
});

// ─── Init ───

renderProductCards();
updateBreakup();
