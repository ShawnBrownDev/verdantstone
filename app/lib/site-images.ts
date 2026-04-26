/** Remote imagery from the original design export (Google Cloud Storage). */
export const siteImages = {
  hero:
    "https://storage.googleapis.com/banani-generated-images/generated-images/34aa276d-acef-4712-9db4-e3938609144a.jpg",
  services: {
    hardscaping:
      "https://storage.googleapis.com/banani-generated-images/generated-images/08a6c104-d1fe-479f-9c55-c4960b3c49b1.jpg",
    outdoorKitchen:
      "https://storage.googleapis.com/banani-generated-images/generated-images/847ff786-fc86-46d4-be1d-4eec84d40b41.jpg",
    waterFeature:
      "https://storage.googleapis.com/banani-generated-images/generated-images/13084e1d-a9b6-40a9-b391-52e9f3842b50.jpg",
  },
  impact: {
    homeownerA:
      "https://storage.googleapis.com/banani-generated-images/generated-images/c13f0f12-151e-41af-b47c-410fcb07f062.jpg",
    homeownerB:
      "https://storage.googleapis.com/banani-generated-images/generated-images/ffd9141f-c049-48d4-a750-d35b0cebf362.jpg",
    before:
      "https://storage.googleapis.com/banani-generated-images/generated-images/e0d9d1c4-06f6-4f18-9c42-505f90b2db81.jpg",
    after:
      "https://storage.googleapis.com/banani-generated-images/generated-images/f75c099c-503d-4322-9cff-bf60a1aab6f7.jpg",
  },
  form: {
    hardscaping:
      "https://storage.googleapis.com/banani-generated-images/generated-images/8f75a87a-aaf7-495e-b027-21e6e558bc08.jpg",
    lawn:
      "https://storage.googleapis.com/banani-generated-images/generated-images/f8c4c105-3ad7-43b8-b208-ff0135eff7d7.jpg",
    landscape:
      "https://storage.googleapis.com/banani-generated-images/generated-images/e8587850-2bd1-44e2-8118-5813128e2a19.jpg",
    outdoorLiving:
      "https://storage.googleapis.com/banani-generated-images/generated-images/6891e4b1-e706-4ea0-92db-65fa6390751c.jpg",
  },
} as const;

/** Portfolio tiles rendered as before/after comparisons. */
export const portfolioGallery = [
  {
    title: "Outdoor kitchen & dining",
    subtitle: "Stone counters, built-ins, and covered entertaining.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: ungraded muddy backyard before kitchen construction",
    afterImage: siteImages.services.outdoorKitchen,
    afterAlt: "After: finished outdoor kitchen and dining patio",
  },
  {
    title: "Water & fire features",
    subtitle: "Custom pools, fountains, and focal lighting.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: basic yard prior to water and fire feature install",
    afterImage: siteImages.services.waterFeature,
    afterAlt: "After: architectural water feature and pool lighting",
  },
  {
    title: "Estate lawn program",
    subtitle: "Seasonal care, irrigation, and crisp edges.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: patchy lawn before regrading and turf work",
    afterImage: siteImages.form.lawn,
    afterAlt: "After: manicured estate lawn and garden beds",
  },
  {
    title: "Landscape architecture",
    subtitle: "Planting plans, grading, and long-term structure.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: unfinished lot before planting plan implementation",
    afterImage: siteImages.form.landscape,
    afterAlt: "After: landscape design with layered planting and paths",
  },
  {
    title: "Outdoor living room",
    subtitle: "Fire features, seating, and layered lighting.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: empty yard before outdoor living buildout",
    afterImage: siteImages.form.outdoorLiving,
    afterAlt: "After: outdoor living space with fire pit and lounge seating",
  },
  {
    title: "Signature hardscaping",
    subtitle: "Patios, walkways, and precision stonework.",
    beforeImage: siteImages.impact.before,
    beforeAlt: "Before: bare yard before patio and hardscaping install",
    afterImage: siteImages.services.hardscaping,
    afterAlt: "After: luxury stone patio and hardscaping detail",
  },
] as const satisfies readonly {
  title: string;
  subtitle: string;
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
}[];
