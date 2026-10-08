export interface TutorialVideo {
  id: string;
  title: string;
  channel: string;
}

// Curated YouTube tutorials, one per guide (verified embeddable).
export const tutorialVideos: Record<string, TutorialVideo> = {
  "straight-seams": { id: "meVu_3Iv-3U", title: "How to sew in a straight line", channel: "Made to Sew" },
  "hem-trousers": { id: "CNopeB23mek", title: "How to hem pants using a blind hem stitch", channel: "Cutesy Crafts" },
  "zipper-pouch": { id: "wc5g641ZH0A", title: "How to make a simple zipper pouch", channel: "Jan Howell" },
  "tote-bag": { id: "BOah0f5p9gM", title: "Fully lined tote bag with boxed corners", channel: "Christine's Home Affairs" },
  "elastic-skirt": { id: "jMgiosQXspo", title: "Easy elastic waist skirt for beginners", channel: "Sew Anastasia" },
  "cushion-cover": { id: "FhZnHhbcN-Q", title: "How to make an envelope pillow cover", channel: "The Crafty Gemini" },
  "repair-seam": { id: "WbE5hXt27uU", title: "How to hand sew an invisible stitch", channel: "OnlineFabricStore" },
  "thread-machine": { id: "iQvt-XozXwA", title: "Threading your sewing machine", channel: "Darling Adventures" },
  "machine-tension": { id: "sf6oPMbLPzo", title: "Sewing machine thread tension", channel: "Professor Pincushion" },
  "blind-hem": { id: "ziijrGl4VqM", title: "Perfect blind hem on a sewing machine", channel: "The Last Stitch" },
  "full-bust-adjustment": { id: "sFpq1eIpRp0", title: "Full bust adjustment for beginners", channel: "Sussex Seamstress" },
  "zippered-pencil-pouch": { id: "jfEzj1x2W9o", title: "How to make a basic zipper pouch", channel: "Kelie Copas" },
  "box-cushion-piping": { id: "ugfcBpo8HDw", title: "Box cushion with piping", channel: "OnlineFabricStore" },
  "visible-denim-darning": { id: "rk7Ixk8nAH4", title: "How to darn a hole in jeans", channel: "Socorro Society" },
  "jeans-to-skirt": { id: "e7hG28clYFI", title: "How to make a skirt from jeans", channel: "Levi's" },
  "shirt-to-bag": { id: "thy36TOhwbY", title: "Tote bag from upcycled T-shirts", channel: "LSU College of Agriculture" },
  "scrap-scrunchies": { id: "GdZrsOK0MIs", title: "The easiest scrunchie tutorial", channel: "Seamwork" },
  "restyle-shirt": { id: "W-SHkq3PgO0", title: "Men's shirt refashion into a women's top", channel: "The House of Re" },
  "fabric-baskets": { id: "7IWAKw_zauw", title: "DIY simple fabric basket", channel: "Minki Kim" },
};
