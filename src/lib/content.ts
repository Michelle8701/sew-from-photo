export type Level = "Beginner" | "Easy" | "Intermediate";
export type Kind = "tutorial" | "upcycle";

export interface Step {
  title: string;
  body: string;
  tip?: string;
}

export interface Guide {
  slug: string;
  kind: Kind;
  title: string;
  summary: string;
  category: string;
  level: Level;
  time: string;
  supplies: string[];
  steps: Step[];
}

export const guides: Guide[] = [
  {
    slug: "straight-seams",
    kind: "tutorial",
    title: "Sew a perfectly straight seam",
    summary: "The one skill every project depends on. Practice on scrap fabric until it feels easy.",
    category: "Basics",
    level: "Beginner",
    time: "20 min",
    supplies: ["Two fabric scraps (cotton)", "Matching thread", "Pins or clips", "Sewing machine"],
    steps: [
      { title: "Set up your machine", body: "Thread the machine and wind a bobbin. Choose a straight stitch, length 2.5 mm.", tip: "Test on a folded scrap first to check the tension looks even on both sides." },
      { title: "Pin right sides together", body: "Lay the two pieces with the pretty sides facing each other. Pin every 10 cm, pins pointing toward the edge." },
      { title: "Line up with the seam guide", body: "Place the fabric edge against the 1.5 cm (5/8\") line on the needle plate. Watch the guide, not the needle.", tip: "A strip of masking tape on the plate makes a great beginner guide." },
      { title: "Backstitch to lock", body: "Sew 3–4 stitches forward, press reverse for 3 stitches, then continue forward." },
      { title: "Sew slowly and steadily", body: "Let the machine feed the fabric. Your hands only steer — don't pull or push. Remove pins just before they reach the needle." },
      { title: "Finish and press", body: "Backstitch at the end, trim threads, and press the seam open with an iron." },
    ],
  },
  {
    slug: "hem-trousers",
    kind: "tutorial",
    title: "Hem trousers or a skirt",
    summary: "Shorten clothes neatly with a classic double-fold hem.",
    category: "Clothing",
    level: "Beginner",
    time: "40 min",
    supplies: ["Garment", "Measuring tape", "Chalk", "Iron", "Pins", "Matching thread"],
    steps: [
      { title: "Mark the new length", body: "Try the garment on with the shoes you'll wear. Fold up to the desired length and pin. Mark the fold with chalk." },
      { title: "Add hem allowance", body: "Measure 4 cm below the chalk line and cut off the excess. This allows for a 1 cm + 3 cm double fold." },
      { title: "Fold and press twice", body: "Fold up 1 cm and press. Fold again along the chalk line and press. Pin all the way around.", tip: "Pressing is half the job — a crisp fold sews itself." },
      { title: "Stitch close to the edge", body: "Sew 2–3 mm from the inner folded edge, working from the inside. Overlap your start by 2 cm." },
      { title: "Final press", body: "Press the finished hem from the outside using a cloth to avoid shine." },
    ],
  },
  {
    slug: "zipper-pouch",
    kind: "tutorial",
    title: "Add a zipper: easy zip pouch",
    summary: "Learn zippers the friendly way with a lined pouch you'll actually use.",
    category: "Bags & accessories",
    level: "Easy",
    time: "1 hr",
    supplies: ["2 outer + 2 lining rectangles, 20×15 cm", "20 cm zipper", "Zipper foot", "Thread"],
    steps: [
      { title: "Make a sandwich", body: "Place an outer piece face up, the zipper face down along the top, then a lining piece face down on top. Pin." },
      { title: "Sew with the zipper foot", body: "Switch to the zipper foot and stitch close to the teeth. Slide the zipper pull out of the way when you reach it.", tip: "Stop with the needle down, lift the foot, move the pull, continue." },
      { title: "Repeat on the other side", body: "Sandwich the other edge of the zipper with the remaining outer and lining pieces. Press both sides away from the teeth." },
      { title: "Topstitch", body: "Topstitch along each side of the zipper for a crisp finish." },
      { title: "Sew the edges", body: "Open the zipper halfway! Put outers together and linings together. Sew around, leaving a 6 cm gap in the lining." },
      { title: "Turn and close", body: "Turn right side out through the gap, push out corners, and stitch the gap closed." },
    ],
  },
  {
    slug: "tote-bag",
    kind: "tutorial",
    title: "Sturdy everyday tote bag",
    summary: "A simple boxed-corner tote — a perfect first bag.",
    category: "Bags & accessories",
    level: "Easy",
    time: "1.5 hr",
    supplies: ["Canvas, 2 × 40×45 cm", "2 straps, 8×60 cm", "Thread", "Iron"],
    steps: [
      { title: "Make the straps", body: "Fold each strap in half lengthwise and press, open, fold edges to the centre, fold again. Topstitch both long sides." },
      { title: "Sew the body", body: "Place body pieces right sides together. Sew sides and bottom with 1.5 cm seams." },
      { title: "Box the corners", body: "Pinch each bottom corner into a triangle so the seams line up. Draw a 10 cm line across and sew. Trim.", tip: "Boxed corners give your bag a flat base so it stands up." },
      { title: "Hem the top", body: "Fold the top edge down 1 cm, then 3 cm. Press." },
      { title: "Attach the straps", body: "Tuck strap ends under the hem, 10 cm from each side seam. Stitch the hem, then sew a box with an X over each strap end." },
    ],
  },
  {
    slug: "elastic-skirt",
    kind: "tutorial",
    title: "Simple elastic-waist skirt",
    summary: "Your first garment — no pattern needed, just two measurements.",
    category: "Clothing",
    level: "Easy",
    time: "2 hr",
    supplies: ["1–1.5 m light woven fabric", "3 cm wide elastic", "Safety pin", "Thread"],
    steps: [
      { title: "Measure", body: "Measure your hips and desired length. Cut a rectangle: width = hips × 1.5, height = length + 8 cm." },
      { title: "Sew the back seam", body: "Fold right sides together, sew the short edges into a tube, finish the seam with zigzag." },
      { title: "Make the waist casing", body: "Fold the top down 1 cm then 4 cm. Stitch around, leaving a 5 cm opening." },
      { title: "Insert elastic", body: "Cut elastic to waist minus 5 cm. Thread it through with a safety pin, overlap the ends 2 cm and sew securely. Close the opening.", tip: "Pin the far end of the elastic to the skirt so it doesn't get pulled inside." },
      { title: "Hem", body: "Finish with a double-fold hem (see Hem tutorial)." },
    ],
  },
  {
    slug: "cushion-cover",
    kind: "tutorial",
    title: "Envelope cushion cover",
    summary: "Quick home decor without zippers or buttons.",
    category: "Home decor",
    level: "Beginner",
    time: "45 min",
    supplies: ["Fabric for 45 cm cushion", "Cushion insert", "Thread"],
    steps: [
      { title: "Cut three pieces", body: "Front: 47×47 cm. Two backs: 47×32 cm each." },
      { title: "Hem the backs", body: "On one long edge of each back piece, fold 1 cm then 2 cm and stitch." },
      { title: "Layer", body: "Front face up. Backs face down on top, hemmed edges overlapping in the middle. Pin." },
      { title: "Sew and turn", body: "Sew all around with 1 cm seam. Clip corners, turn right side out, insert cushion." },
    ],
  },
  {
    slug: "repair-seam",
    kind: "tutorial",
    title: "Repair a split seam & sew a button",
    summary: "Two fixes that rescue most damaged clothes.",
    category: "Repair",
    level: "Beginner",
    time: "25 min",
    supplies: ["Hand needle", "Matching thread", "Button", "Pins"],
    steps: [
      { title: "Turn inside out", body: "Find where the original stitching ends on both sides of the split. Pin the seam closed." },
      { title: "Overlap old stitches", body: "Start 2 cm into the good stitching, and sew along the original line with a small backstitch or machine straight stitch." },
      { title: "Secure the end", body: "Continue 2 cm past the split into the good stitches and knot or backstitch." },
      { title: "Sew a button: position", body: "Mark the button spot. Bring a doubled, knotted thread up from the back." },
      { title: "Make a shank", body: "Place a pin across the button and sew over it 6–8 times. Remove the pin, wrap thread around the stitches under the button 3 times, knot at the back.", tip: "The little shank gives room for the buttonhole fabric." },
    ],
  },
  {
    slug: "jeans-to-skirt",
    kind: "upcycle",
    title: "Turn old jeans into a skirt",
    summary: "The classic upcycle — keep the comfy waistband, lose the legs.",
    category: "Restyle",
    level: "Intermediate",
    time: "2 hr",
    supplies: ["Old jeans", "Seam ripper", "Denim needle (100/16)", "Extra denim scraps"],
    steps: [
      { title: "Cut the legs", body: "Cut the legs off a little longer than your desired skirt length." },
      { title: "Open the inner seams", body: "Unpick the inside leg seams and the curved crotch seam front and back, up to the zip and down from the back yoke." },
      { title: "Flatten the front & back", body: "Overlap the front crotch pieces so they lie flat, pin, and topstitch with denim thread. Repeat at the back." },
      { title: "Fill the triangles", body: "Pin denim scraps (from the cut legs) behind the triangular gaps at front and back. Topstitch and trim.", tip: "Use the old hems for a ready-finished look." },
      { title: "Finish the hem", body: "Fray the bottom edge for a casual look, or double-fold and stitch." },
    ],
  },
  {
    slug: "shirt-to-bag",
    kind: "upcycle",
    title: "T-shirt into a no-sew-friendly tote",
    summary: "Turn a favourite tee into a shopping bag in under 30 minutes.",
    category: "Bags",
    level: "Beginner",
    time: "30 min",
    supplies: ["Old T-shirt", "Scissors", "Thread (optional)"],
    steps: [
      { title: "Cut sleeves and neckline", body: "Cut off both sleeves just inside the seam. Cut a deeper scoop at the neckline — this becomes the bag opening and handles." },
      { title: "Close the bottom", body: "Turn inside out and sew straight across the bottom hem. No machine? Cut 8 cm fringe strips and tie front-to-back pairs." },
      { title: "Turn and use", body: "Turn right side out. The shoulders are now your handles!" },
    ],
  },
  {
    slug: "scrap-scrunchies",
    kind: "upcycle",
    title: "Fabric-scrap scrunchies",
    summary: "Use small leftovers for quick, giftable accessories.",
    category: "Scraps",
    level: "Beginner",
    time: "15 min",
    supplies: ["Scrap 50×10 cm", "Elastic 20 cm (6 mm)", "Safety pin"],
    steps: [
      { title: "Sew a tube", body: "Fold the strip lengthwise right sides together and sew the long edge. Turn right side out." },
      { title: "Thread the elastic", body: "Feed elastic through with a safety pin. Overlap the elastic ends and stitch them together." },
      { title: "Close the ring", body: "Tuck one raw end inside the other, fold under, and stitch closed." },
    ],
  },
  {
    slug: "restyle-shirt",
    kind: "upcycle",
    title: "Restyle a men's shirt into a cropped top",
    summary: "Give an oversized shirt a fresh, fitted silhouette.",
    category: "Restyle",
    level: "Intermediate",
    time: "1.5 hr",
    supplies: ["Button-up shirt", "Chalk", "Pins", "Thread"],
    steps: [
      { title: "Try on and pin", body: "Wear the shirt inside out. Pin the side seams to a comfortable fit and mark the crop length." },
      { title: "Sew new side seams", body: "Sew along the pins from underarm to hem, blending smoothly into the old seam. Trim and zigzag." },
      { title: "Shorten sleeves", body: "Cut sleeves to elbow plus 3 cm and double-fold hem them." },
      { title: "Crop and hem", body: "Cut at the crop line plus 2 cm. Double-fold and stitch." },
    ],
  },
  {
    slug: "fabric-baskets",
    kind: "upcycle",
    title: "Leftover-fabric storage baskets",
    summary: "Soft baskets from old curtains, jeans, or quilting scraps.",
    category: "Home decor",
    level: "Easy",
    time: "1 hr",
    supplies: ["Outer + lining 2 × 30×25 cm each", "Fusible interfacing", "Thread"],
    steps: [
      { title: "Stiffen the outer", body: "Iron interfacing onto the outer pieces." },
      { title: "Sew two bags", body: "Sew outers together on sides and bottom; repeat with lining, leaving a gap." },
      { title: "Box the corners", body: "Box all corners 8 cm wide for a flat base." },
      { title: "Join and turn", body: "Put outer inside lining (right sides together), sew around the top, turn through the gap, close it, and fold down a cuff." },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
