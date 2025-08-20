// export default function AboutMe() {
//   const photos = [
//     {
//       src: "/favicon.jpg",
//       caption: "Music is my engine. Always building with a beat in the background.",
//     },
//     {
//       src: "https://source.unsplash.com/400x400/?notebook,doodle",
//       caption: "Ideas land messy. Scribbles, cross-outs, and sparks.",
//     },
//     {
//       src: "https://source.unsplash.com/400x400/?stars,night",
//       caption: "Always looking up. Thinking in orbits, not straight lines.",
//     },
//     {
//       src: "https://source.unsplash.com/400x400/?friends,people",
//       caption: "That’s me — somewhere in the middle, curious and laughing.",
//     },
//     {
//       src: "https://source.unsplash.com/400x400/?code,computer",
//       caption: "Making things that sometimes break, but break forward.",
//     },
//     {
//       src: "https://source.unsplash.com/400x400/?coffee,mug",
//       caption: "The small things carry the big ideas.",
//     },
//   ];

//   return (
//     <section className="py-20 bg-background text-foreground">
//       <h2 className="text-4xl sm:text-6xl font-bold text-center mb-16">About Me</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
//         {photos.map((photo, idx) => (
//           <div
//             key={idx}
//             className="relative bg-white p-3 shadow-lg polaroid transform rotate-[-2deg] hover:rotate-0 transition"
//           >
//             <img
//               src={photo.src}
//               alt="About snippet"
//               className="w-full h-64 object-cover"
//             />
//             <p className="text-sm text-gray-700 mt-3">{photo.caption}</p>
//           </div>
//         ))}
//       </div>
//       <p className="text-center text-lg sm:text-xl mt-12 font-medium text-foreground/80">
//         I’m Shreyaj. I make things, I break things, I learn from both.  
//         This is me in fragments.
//       </p>
//     </section>
//   );
// }
