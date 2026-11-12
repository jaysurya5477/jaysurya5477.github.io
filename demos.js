/*
  DEMO LIST: this is the only file you edit to add a demo.
  Copy one block, paste it at the end of the list, change the values, save, commit, push.

  title  : heading on the card
  desc   : one short line under the heading (optional)
  src    : the link OR the file path (see below)
  type   : optional label: "video" | "slides" | "pdf" | "image" | "doc". Guessed from the link if left out.
  thumb  : optional preview image (link or file path). Google Drive videos get one automatically.

  What you can put in src:
    - Google Drive file link (video, PDF, image, slides)   https://drive.google.com/file/d/.../view
    - Google Slides / Docs / Sheets link                    https://docs.google.com/presentation/d/.../edit
    - YouTube link                                          https://www.youtube.com/watch?v=...
    - A file you added to this repo                         assets/demos/my-demo.mp4  (.mp4 .webm .pdf .png .jpg .gif .pptx .docx .xlsx)

  Google Drive links only play for visitors if the file is shared as "Anyone with the link can view".
  Keep repo files small (GitHub rejects files over 100 MB). For big videos use Drive or YouTube.
*/
window.DEMOS = [
  {
    title: "Dashboard demo 1",
    desc: "Test simulation data",
    type: "video",
    src: "https://drive.google.com/file/d/1MPUPnqNRj0QPMUfKW0z7sA8BIjNWGKXT/view?usp=sharing"
  },
  {
    title: "Dashboard demo 2",
    desc: "Test simulation data",
    type: "video",
    src: "https://drive.google.com/file/d/1qfNV3oY9AaoesTjaJcTJVRz8iiEf1vdr/view?usp=sharing"
  },
  {
    title: "Dashboard demo 3",
    desc: "Test simulation data",
    type: "video",
    src: "https://drive.google.com/file/d/1zrGq5jGcpLpa1LXPDGBfF98EhRWXdvin/view?usp=sharing"
  }, 
  {
    title: "Dashboard demo 4",
    desc: "Test simulation data",
    type: "video",
    src: "https://drive.google.com/file/d/1k4Fwu3vTCgDmrWLMPQ70pSLZqxFf5rnw/view?usp=sharing"
  }
  // , { title: "Next demo", desc: "What it shows", src: "assets/demos/next-demo.mp4" }
];
