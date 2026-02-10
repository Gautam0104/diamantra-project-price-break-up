// ─── Product Data ───

const TYPE_ICONS = {
  Ring: "💍",
  Pendant: "📿",
  Necklace: "✨",
  Earring: "✦",
  Bracelet: "⟡",
  Bangle: "◎",
};

let nextId = 4;

let products = [
  {
    id: 1,
    name: "Eternal Promise Ring",
    subtitle: "Solitaire Promise Ring",
    productCode: "CVDSWR001",
    type: "Ring",
    goldWeight: 1.8,
    diamondCharges: 28500,
    description:
      "This ring celebrates enduring love with its polished band and radiant lab-grown diamond. Each sparkle captures a promise that lasts forever.",
  },
  {
    id: 2,
    name: "Celestial Drop Pendant",
    subtitle: "Pear Solitaire Drop",
    productCode: "CVDSPN002",
    type: "Pendant",
    goldWeight: 0.9,
    diamondCharges: 20000,
    description:
      "A captivating pear-shaped lab-grown diamond suspended from a delicate chain. Perfect for layering or as a standalone statement piece.",
  },
  {
    id: 3,
    name: "Grand Royale Necklace",
    subtitle: "Heritage Statement Necklace",
    productCode: "CVDSNK003",
    type: "Necklace",
    goldWeight: 5.2,
    diamondCharges: 140000,
    description:
      "A grand statement necklace with multiple precision-cut lab-grown diamonds set along a wide gold chain. Designed for special occasions.",
  },
];

// Making charge rates for the two categories
const MAKING_RATE_CASE_1 = 1100; // Gold Jewellery
const MAKING_RATE_CASE_2 = 1300; // Gold Enamel Jewellery

// GST rate on gold jewellery
const GST_RATE = 3; // percent

// ─── Pricing Logic ───

/**
 * Calculates the pricing breakup for a jewellery product.
 * Total is built up from components (not derived from a fixed SP).
 *
 * Gold Charges    = goldRate × goldWeight
 * Making Charges  = flat rate (≤1g) or rate × weight (>1g)
 * Diamond Charges = fixed per product (same diamonds regardless of category)
 * Subtotal        = Gold + Making + Diamond
 * GST             = 3% of Subtotal
 * Total           = Subtotal + GST
 */
function calculateBreakup(diamondCharges, goldWeight, goldRate, makingRate) {
  const goldCharges = goldRate * goldWeight;

  // Making charges: flat rate for ≤1g, per-gram for >1g
  const makingCharges =
    goldWeight <= 1 ? makingRate : makingRate * goldWeight;

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
const productCardsContainer = document.getElementById("productCards");
const productNameEl = document.getElementById("productName");
const productSubtitleEl = document.getElementById("productSubtitle");
const productCodeEl = document.getElementById("productCode");
const productDescEl = document.getElementById("productDesc");
const productPriceEl = document.getElementById("productPrice");
const specsTableEl = document.getElementById("specsTable");
const editProductBtn = document.getElementById("editProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");

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
const fGoldWeight = document.getElementById("fGoldWeight");
const fDiamondCharges = document.getElementById("fDiamondCharges");
const fDesc = document.getElementById("fDesc");

let selectedProductId = products[0].id;
let editingProductId = null; // null = add mode, number = edit mode
let selectedCategory = "pure-gold"; // "pure-gold" or "gold-enamel"

// Category tab & card references
const tabPureGold = document.getElementById("tabPureGold");
const tabGoldEnamel = document.getElementById("tabGoldEnamel");
const c1Card = document.getElementById("c1Card");
const c2Card = document.getElementById("c2Card");
const c1MakingLabel = document.getElementById("c1MakingLabel");
const c2MakingLabel = document.getElementById("c2MakingLabel");

// ─── Modal ───

function openModal(mode, product) {
  if (mode === "edit" && product) {
    editingProductId = product.id;
    modalTitle.textContent = "Edit Product";
    modalSubmit.textContent = "Save Changes";
    fName.value = product.name;
    fSubtitle.value = product.subtitle;
    fCode.value = product.productCode;
    fType.value = product.type;
    fGoldWeight.value = product.goldWeight;
    fDiamondCharges.value = product.diamondCharges;
    fDesc.value = product.description;
  } else {
    editingProductId = null;
    modalTitle.textContent = "Add Product";
    modalSubmit.textContent = "Add Product";
    productForm.reset();
  }
  modalOverlay.classList.add("modal-overlay--open");
}

function closeModal() {
  modalOverlay.classList.remove("modal-overlay--open");
  editingProductId = null;
}

// ─── CRUD ───

function addProduct(data) {
  const product = {
    id: nextId++,
    name: data.name,
    subtitle: data.subtitle,
    productCode: data.productCode,
    type: data.type,
    goldWeight: data.goldWeight,
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
  product.goldWeight = data.goldWeight;
  product.diamondCharges = data.diamondCharges;
  product.description = data.description;
  refreshAll();
}

function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  if (products.length === 0) {
    // Must have at least one; re-add a default
    products.push({
      id: nextId++,
      name: "New Product",
      subtitle: "Subtitle",
      productCode: "CODE001",
      type: "Ring",
      goldWeight: 1.0,
      diamondCharges: 10000,
      description: "",
    });
  }
  if (selectedProductId === id) {
    selectedProductId = products[0].id;
  }
  refreshAll();
}

// ─── Category Toggle ───

function switchCategory(category) {
  selectedCategory = category;
  tabPureGold.classList.toggle("breakup-tab--active", category === "pure-gold");
  tabGoldEnamel.classList.toggle("breakup-tab--active", category === "gold-enamel");
  c1Card.style.display = category === "pure-gold" ? "block" : "none";
  c2Card.style.display = category === "gold-enamel" ? "block" : "none";
  updateBreakup();
}

// ─── Render ───

function refreshAll() {
  renderProductCards();
  updateBreakup();
}

function renderProductCards() {
  const goldRate = parseFloat(goldRateInput.value) || 0;

  const cards = products
    .map((p) => {
      const makingRate = selectedCategory === "pure-gold" ? MAKING_RATE_CASE_1 : MAKING_RATE_CASE_2;
      const breakup = calculateBreakup(p.diamondCharges, p.goldWeight, goldRate, makingRate);
      const icon = TYPE_ICONS[p.type] || "◆";
      return `
    <div class="product-card ${p.id === selectedProductId ? "product-card--active" : ""}"
         data-id="${p.id}">
      <div class="product-card__image">
        <span class="product-card__image-icon">${icon}</span>
        <div class="product-card__badge">
          <div class="ribbon">${p.type}</div>
          <div class="ribbon-fold"></div>
        </div>
      </div>
      <div class="product-card__info">
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__subtitle">${p.subtitle} · ${p.goldWeight}g gold</div>
        <div class="product-card__price">${formatINR(breakup.total)}</div>
      </div>
    </div>
  `;
    })
    .join("");

  // Add Product card
  const addCard = `
    <div class="product-card--add" id="addProductCard">
      <div class="product-card--add__icon">+</div>
      <div class="product-card--add__label">Add Product</div>
    </div>
  `;

  productCardsContainer.innerHTML = cards + addCard;

  // Product card click listeners
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedProductId = parseInt(card.dataset.id, 10);
      renderProductCards();
      updateBreakup();
    });
  });

  // Add card click
  document.getElementById("addProductCard").addEventListener("click", () => {
    openModal("add");
  });
}

function buildSpecsFromProduct(product) {
  return {
    "Product Code": product.productCode,
    Category: product.type,
    "Gold Weight": product.goldWeight + "g",
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

  // Case 1
  const case1 = calculateBreakup(
    product.diamondCharges,
    product.goldWeight,
    goldRate,
    MAKING_RATE_CASE_1
  );

  // Update product detail section
  productNameEl.textContent = product.name;
  productSubtitleEl.textContent = product.subtitle;
  productCodeEl.textContent = product.productCode;
  productDescEl.textContent = product.description;
  productPriceEl.textContent = formatINR(
    selectedCategory === "pure-gold" ? case1.total : case2.total
  );

  // Hide "Making Charge @ ₹X/g" label when weight < 1g (flat rate applies)
  c1MakingLabel.style.display = product.goldWeight < 1 ? "none" : "block";
  c2MakingLabel.style.display = product.goldWeight < 1 ? "none" : "block";

  // Render specs table
  renderSpecsTable(product);

  document.getElementById("c1GoldWeight").textContent = `${product.goldWeight}g`;
  document.getElementById("c1GoldRate").textContent = `${formatINR(goldRate)}/g`;
  document.getElementById("c1GoldCharges").textContent = formatINR(case1.goldCharges);
  document.getElementById("c1MakingCharges").textContent = formatINR(case1.makingCharges);
  document.getElementById("c1DiamondCharges").textContent = formatINR(case1.diamondCharges);
  document.getElementById("c1Subtotal").textContent = formatINR(case1.subtotal);
  document.getElementById("c1GST").textContent = formatINR(case1.gst);
  document.getElementById("c1Total").textContent = formatINR(case1.total);

  // Case 2
  const case2 = calculateBreakup(
    product.diamondCharges,
    product.goldWeight,
    goldRate,
    MAKING_RATE_CASE_2
  );

  document.getElementById("c2GoldWeight").textContent = `${product.goldWeight}g`;
  document.getElementById("c2GoldRate").textContent = `${formatINR(goldRate)}/g`;
  document.getElementById("c2GoldCharges").textContent = formatINR(case2.goldCharges);
  document.getElementById("c2MakingCharges").textContent = formatINR(case2.makingCharges);
  document.getElementById("c2DiamondCharges").textContent = formatINR(case2.diamondCharges);
  document.getElementById("c2Subtotal").textContent = formatINR(case2.subtotal);
  document.getElementById("c2GST").textContent = formatINR(case2.gst);
  document.getElementById("c2Total").textContent = formatINR(case2.total);
}

// ─── Event Listeners ───

goldRateInput.addEventListener("input", refreshAll);

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

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: fName.value.trim(),
    subtitle: fSubtitle.value.trim(),
    productCode: fCode.value.trim(),
    type: fType.value,
    goldWeight: parseFloat(fGoldWeight.value) || 0,
    diamondCharges: parseFloat(fDiamondCharges.value) || 0,
    description: fDesc.value.trim(),
  };

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
