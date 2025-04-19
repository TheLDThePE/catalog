import { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [catFact, setCatFact] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  const [images, setImages] = useState({
    catApi: { url: "https://placehold.co/300x200", src: "..." },
    cataas: { url: "https://placehold.co/200x200", src: "..." },
    pexels: { url: "https://placehold.co/300x200", src: "..." },
    catApiGif: { url: "https://placehold.co/300x200", src: "..." }, // แทน Unsplash ด้วย The Cat API GIF
    pixabay: { url: "https://placehold.co/300x200", src: "..." },
    catApiRandomBreed: { url: "https://placehold.co/300x200", src: "..." },
  });
  const [lastFetchTime, setLastFetchTime] = useState({
    catApi: 0,
    cataas: 0,
    pexels: 0,
    catApiGif: 0, // แทน Unsplash
    pixabay: 0,
    catApiRandomBreed: 0,
    catFact: 0,
  });
  const minFetchInterval = {
    pixabay: 17280, // 17.28 seconds (5,000 requests/day)
    pexels: 18000, // 18 seconds (200 requests/hour)
    catApi: 7000, // 7 seconds (no strict limit)
    cataas: 7000, // 7 seconds (no strict limit)
    catApiRandomBreed: 7000, // 7 seconds (no strict limit)
    catApiGif: 7000, // 7 seconds (no strict limit, เหมือน The Cat API อื่นๆ)
    catFact: 30000, // 30 seconds
  };

  // List of cat breed IDs for random selection (all breeds from The Cat API)
  const catBreeds = [
    { id: "abys", name: "Abyssinian" },
    { id: "aege", name: "Aegean" },
    { id: "abob", name: "American Bobtail" },
    { id: "acur", name: "American Curl" },
    { id: "asho", name: "American Shorthair" },
    { id: "awir", name: "American Wirehair" },
    { id: "amau", name: "Arabian Mau" },
    { id: "amis", name: "Australian Mist" },
    { id: "bali", name: "Balinese" },
    { id: "bamb", name: "Bambino" },
    { id: "beng", name: "Bengal" },
    { id: "birm", name: "Birman" },
    { id: "bomb", name: "Bombay" },
    { id: "bslo", name: "British Longhair" },
    { id: "bsho", name: "British Shorthair" },
    { id: "bure", name: "Burmese" },
    { id: "buri", name: "Burmilla" },
    { id: "cspa", name: "California Spangled" },
    { id: "ctif", name: "Chantilly-Tiffany" },
    { id: "char", name: "Chartreux" },
    { id: "chau", name: "Chausie" },
    { id: "chee", name: "Cheetoh" },
    { id: "csho", name: "Colorpoint Shorthair" },
    { id: "crex", name: "Cornish Rex" },
    { id: "cymr", name: "Cymric" },
    { id: "cypr", name: "Cyprus" },
    { id: "drex", name: "Devon Rex" },
    { id: "dons", name: "Donskoy" },
    { id: "lihu", name: "Dragon Li" },
    { id: "emau", name: "Egyptian Mau" },
    { id: "ebur", name: "European Burmese" },
    { id: "exot", name: "Exotic Shorthair" },
    { id: "hbro", name: "Havana Brown" },
    { id: "hima", name: "Himalayan" },
    { id: "jbob", name: "Japanese Bobtail" },
    { id: "javu", name: "Javanese" },
    { id: "khao", name: "Khao Manee" },
    { id: "kora", name: "Korat" },
    { id: "kuri", name: "Kurilian" },
    { id: "lape", name: "LaPerm" },
    { id: "mcoo", name: "Maine Coon" },
    { id: "mala", name: "Malayan" },
    { id: "manx", name: "Manx" },
    { id: "munch", name: "Munchkin" },
    { id: "nebe", name: "Nebelung" },
    { id: "norw", name: "Norwegian Forest Cat" },
    { id: "ocic", name: "Ocicat" },
    { id: "orie", name: "Oriental" },
    { id: "pers", name: "Persian" },
    { id: "pixi", name: "Pixie-bob" },
    { id: "raga", name: "Ragamuffin" },
    { id: "ragd", name: "Ragdoll" },
    { id: "rblu", name: "Russian Blue" },
    { id: "sava", name: "Savannah" },
    { id: "sfol", name: "Scottish Fold" },
    { id: "srex", name: "Selkirk Rex" },
    { id: "siam", name: "Siamese" },
    { id: "sibe", name: "Siberian" },
    { id: "sing", name: "Singapura" },
    { id: "snow", name: "Snowshoe" },
    { id: "soma", name: "Somali" },
    { id: "sphy", name: "Sphynx" },
    { id: "tonk", name: "Tonkinese" },
    { id: "toyg", name: "Toyger" },
    { id: "tvan", name: "Turkish Van" },
    { id: "tang", name: "Turkish Angora" },
    { id: "ycho", name: "York Chocolate" },
  ];

  // Fetch cat fact
  const fetchCatFact = async () => {
    const now = Date.now();
    if (now - lastFetchTime.catFact < minFetchInterval.catFact) return;

    try {
      const response = await fetch("https://catfact.ninja/fact");
      if (!response.ok) throw new Error("Cat fact fetch failed");
      const data = await response.json();
      const fact = data.fact;
      setCatFact(fact);
      setLastFetchTime((prev) => ({ ...prev, catFact: now }));
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      setCatFact("Error loading fact");
    }
  };

  // Fetch images from APIs
  const fetchImages = async () => {
    const now = Date.now();
    const newImages = { ...images };

    // 1. The Cat API (Random)
    if (now - lastFetchTime.catApi >= minFetchInterval.catApi) {
      try {
        const catApiResponse = await fetch("https://api.thecatapi.com/v1/images/search");
        if (!catApiResponse.ok) throw new Error("The Cat API fetch failed");
        const catApiData = await catApiResponse.json();
        if (!catApiData || catApiData.length === 0) throw new Error("No Cat API photos found");
        newImages.catApi = { url: catApiData[0].url, src: catApiData[0].url };
        setLastFetchTime((prev) => ({ ...prev, catApi: now }));
      } catch (error) {
        console.error("Error fetching The Cat API:", error);
        newImages.catApi = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    // 2. CATAAS
    if (now - lastFetchTime.cataas >= minFetchInterval.cataas) {
      try {
        const timestamp = new Date().getTime();
        const cataasUrl = `https://cataas.com/cat?t=${timestamp}`;
        newImages.cataas = { url: cataasUrl, src: cataasUrl };
        setLastFetchTime((prev) => ({ ...prev, cataas: now }));
      } catch (error) {
        console.error("Error fetching CATAAS:", error);
        newImages.cataas = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    // 3. Pexels
    if (now - lastFetchTime.pexels >= minFetchInterval.pexels) {
      try {
        const pexelsResponse = await fetch(
          "https://api.pexels.com/v1/search?query=cats&per_page=10",
          {
            headers: { Authorization: "CxBcXd4YfOt4679s3kpsypY0bk826ai0rDyqAquObNTn7S9JjtDadtOo" },
          }
        );
        if (!pexelsResponse.ok) throw new Error("Pexels fetch failed");
        const pexelsData = await pexelsResponse.json();
        if (!pexelsData.photos || pexelsData.photos.length === 0) throw new Error("No Pexels photos found");
        const randomIndex = Math.floor(Math.random() * pexelsData.photos.length);
        const randomPhoto = pexelsData.photos[randomIndex];
        newImages.pexels = { url: randomPhoto.src.medium, src: randomPhoto.url };
        setLastFetchTime((prev) => ({ ...prev, pexels: now }));
      } catch (error) {
        console.error("Error fetching Pexels:", error);
        newImages.pexels = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    // 4. The Cat API GIF (แทน Unsplash)
    if (now - lastFetchTime.catApiGif >= minFetchInterval.catApiGif) {
      try {
        const catApiGifResponse = await fetch("https://api.thecatapi.com/v1/images/search?mime_types=gif");
        if (!catApiGifResponse.ok) throw new Error("The Cat API GIF fetch failed");
        const catApiGifData = await catApiGifResponse.json();
        if (!catApiGifData || catApiGifData.length === 0) throw new Error("No Cat API GIFs found");
        newImages.catApiGif = { url: catApiGifData[0].url, src: catApiGifData[0].url };
        setLastFetchTime((prev) => ({ ...prev, catApiGif: now }));
      } catch (error) {
        console.error("Error fetching The Cat API GIF:", error);
        newImages.catApiGif = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    // 5. Pixabay
    if (now - lastFetchTime.pixabay >= minFetchInterval.pixabay) {
      try {
        const maxPages = 25; // Pixabay limits to 500 hits, 20 per page = 25 pages max
        const randomPage = Math.floor(Math.random() * maxPages) + 1;
        const pixabayResponse = await fetch(
          `https://pixabay.com/api/?key=49787186-d5fab3da14d29c52084f73c4a&q=cats&image_type=photo&per_page=20&page=${randomPage}`
        );
        if (!pixabayResponse.ok) throw new Error("Pixabay fetch failed");
        const pixabayData = await pixabayResponse.json();
        if (!pixabayData.hits || pixabayData.hits.length === 0) throw new Error("No Pixabay photos found");
        const randomIndex = Math.floor(Math.random() * pixabayData.hits.length);
        newImages.pixabay = {
          url: pixabayData.hits[randomIndex].webformatURL,
          src: pixabayData.hits[randomIndex].pageURL,
        };
        setLastFetchTime((prev) => ({ ...prev, pixabay: now }));
      } catch (error) {
        console.error("Error fetching Pixabay:", error);
        newImages.pixabay = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    // 6. The Cat API (Random Breed)
    if (now - lastFetchTime.catApiRandomBreed >= minFetchInterval.catApiRandomBreed) {
      try {
        const randomBreed = catBreeds[Math.floor(Math.random() * catBreeds.length)];
        const catApiRandomBreedResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${randomBreed.id}`);
        if (!catApiRandomBreedResponse.ok) throw new Error("The Cat API Random Breed fetch failed");
        const catApiRandomBreedData = await catApiRandomBreedResponse.json();
        if (!catApiRandomBreedData || catApiRandomBreedData.length === 0) throw new Error("No Random Breed Cat API photos found");
        newImages.catApiRandomBreed = { url: catApiRandomBreedData[0].url, src: catApiRandomBreedData[0].url };
        setLastFetchTime((prev) => ({ ...prev, catApiRandomBreed: now }));
      } catch (error) {
        console.error("Error fetching The Cat API Random Breed:", error);
        newImages.catApiRandomBreed = { url: "https://placehold.co/300x200", src: "Error" };
      }
    }

    setImages(newImages);
  };

  // Periodic fetching with cleanup
  useEffect(() => {
    // Initial fetch
    fetchCatFact();
    fetchImages();

    // Set up intervals
    const factInterval = setInterval(fetchCatFact, minFetchInterval.catFact);
    const imageInterval = setInterval(fetchImages, minFetchInterval.catApiRandomBreed); // 7s for frequent checks

    // Cleanup on unmount
    return () => {
      clearInterval(factInterval);
      clearInterval(imageInterval);
    };
  }, []);

  // Card list
  const allCards = [
    { title: "The Cat API", imgSrc: images.catApi.url, srcLink: images.catApi.src },
    { title: "CATAAS", imgSrc: images.cataas.url, srcLink: images.cataas.src },
    { title: "Pexels", imgSrc: images.pexels.url, srcLink: images.pexels.src },
    { title: "The Cat API GIF", imgSrc: images.catApiGif.url, srcLink: images.catApiGif.src }, // แทน Unsplash
    { title: "Pixabay", imgSrc: images.pixabay.url, srcLink: images.pixabay.src },
    { title: "The Cat API Random Breed", imgSrc: images.catApiRandomBreed.url, srcLink: images.catApiRandomBreed.src },
  ];

  // Calculate cards for current page
  const totalPages = Math.ceil(allCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = allCards.slice(startIndex, startIndex + cardsPerPage);

  // Page navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">CAT ta' log</h1>
      </nav>

      {/* Card grid */}
      <div className="grid-container-wrapper">
        {currentPage > 1 && (
          <div className="arrow arrow-left" onClick={prevPage}>
            <div className="arrow-icon arrow-icon-left"></div>
          </div>
        )}
        <div className="grid-container">
          {currentCards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              imgSrc={card.imgSrc}
              srcLink={card.srcLink}
            />
          ))}
        </div>
        {currentPage < totalPages && (
          <div className="arrow arrow-right" onClick={nextPage}>
            <div className="arrow-icon arrow-icon-right"></div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="navbar2">
          <p className="navbar2-text">Cat Fact: {catFact}</p>
        </div>
      </footer>
    </div>
  );
};

const Card = ({ title, imgSrc, srcLink }) => (
  <div className="card">
    <img src={imgSrc} alt={title} className="card-img" />
    <p className="card-title">{title}</p>
    <p className="card-link">
      Source link:{" "}
      <a href={srcLink} target="_blank" rel="noopener noreferrer">
        {srcLink}
      </a>
    </p>
  </div>
);

export default App;














// import { useState, useEffect } from "react";
// import "./index.css";

// const App = () => {
//   const [catFact, setCatFact] = useState("Loading...");
//   const [currentPage, setCurrentPage] = useState(1);
//   const cardsPerPage = 3;
//   const [images, setImages] = useState({
//     catApi: { url: "https://placehold.co/300x200", src: "..." },
//     cataas: { url: "https://placehold.co/200x200", src: "..." },
//     pexels: { url: "https://placehold.co/300x200", src: "..." },
//     randomCat: { url: "https://placehold.co/300x200", src: "..." }, // เปลี่ยนจาก catApiGif เป็น randomCat
//     pixabay: { url: "https://placehold.co/300x200", src: "..." },
//     catApiRandomBreed: { url: "https://placehold.co/300x200", src: "..." },
//   });
//   const [lastFetchTime, setLastFetchTime] = useState({
//     catApi: 0,
//     cataas: 0,
//     pexels: 0,
//     randomCat: 0, // เปลี่ยนจาก catApiGif
//     pixabay: 0,
//     catApiRandomBreed: 0,
//     catFact: 0,
//   });
//   const minFetchInterval = {
//     pixabay: 17280, // 17.28 seconds (5,000 requests/day)
//     pexels: 18000, // 18 seconds (200 requests/hour)
//     catApi: 7000, // 7 seconds (no strict limit)
//     cataas: 7000, // 7 seconds (no strict limit)
//     catApiRandomBreed: 7000, // 7 seconds (no strict limit)
//     randomCat: 7000, // 7 seconds (no strict limit, เดิม catApiGif)
//     catFact: 30000, // 30 seconds
//   };

//   // List of cat breed IDs for random selection (all breeds from The Cat API)
//   const catBreeds = [
//     { id: "abys", name: "Abyssinian" },
//     { id: "aege", name: "Aegean" },
//     { id: "abob", name: "American Bobtail" },
//     { id: "acur", name: "American Curl" },
//     { id: "asho", name: "American Shorthair" },
//     { id: "awir", name: "American Wirehair" },
//     { id: "amau", name: "Arabian Mau" },
//     { id: "amis", name: "Australian Mist" },
//     { id: "bali", name: "Balinese" },
//     { id: "bamb", name: "Bambino" },
//     { id: "beng", name: "Bengal" },
//     { id: "birm", name: "Birman" },
//     { id: "bomb", name: "Bombay" },
//     { id: "bslo", name: "British Longhair" },
//     { id: "bsho", name: "British Shorthair" },
//     { id: "bure", name: "Burmese" },
//     { id: "buri", name: "Burmilla" },
//     { id: "cspa", name: "California Spangled" },
//     { id: "ctif", name: "Chantilly-Tiffany" },
//     { id: "char", name: "Chartreux" },
//     { id: "chau", name: "Chausie" },
//     { id: "chee", name: "Cheetoh" },
//     { id: "csho", name: "Colorpoint Shorthair" },
//     { id: "crex", name: "Cornish Rex" },
//     { id: "cymr", name: "Cymric" },
//     { id: "cypr", name: "Cyprus" },
//     { id: "drex", name: "Devon Rex" },
//     { id: "dons", name: "Donskoy" },
//     { id: "lihu", name: "Dragon Li" },
//     { id: "emau", name: "Egyptian Mau" },
//     { id: "ebur", name: "European Burmese" },
//     { id: "exot", name: "Exotic Shorthair" },
//     { id: "hbro", name: "Havana Brown" },
//     { id: "hima", name: "Himalayan" },
//     { id: "jbob", name: "Japanese Bobtail" },
//     { id: "javu", name: "Javanese" },
//     { id: "khao", name: "Khao Manee" },
//     { id: "kora", name: "Korat" },
//     { id: "kuri", name: "Kurilian" },
//     { id: "lape", name: "LaPerm" },
//     { id: "mcoo", name: "Maine Coon" },
//     { id: "mala", name: "Malayan" },
//     { id: "manx", name: "Manx" },
//     { id: "munch", name: "Munchkin" },
//     { id: "nebe", name: "Nebelung" },
//     { id: "norw", name: "Norwegian Forest Cat" },
//     { id: "ocic", name: "Ocicat" },
//     { id: "orie", name: "Oriental" },
//     { id: "pers", name: "Persian" },
//     { id: "pixi", name: "Pixie-bob" },
//     { id: "raga", name: "Ragamuffin" },
//     { id: "ragd", name: "Ragdoll" },
//     { id: "rblu", name: "Russian Blue" },
//     { id: "sava", name: "Savannah" },
//     { id: "sfol", name: "Scottish Fold" },
//     { id: "srex", name: "Selkirk Rex" },
//     { id: "siam", name: "Siamese" },
//     { id: "sibe", name: "Siberian" },
//     { id: "sing", name: "Singapura" },
//     { id: "snow", name: "Snowshoe" },
//     { id: "soma", name: "Somali" },
//     { id: "sphy", name: "Sphynx" },
//     { id: "tonk", name: "Tonkinese" },
//     { id: "toyg", name: "Toyger" },
//     { id: "tvan", name: "Turkish Van" },
//     { id: "tang", name: "Turkish Angora" },
//     { id: "ycho", name: "York Chocolate" },
//   ];

//   // Fetch cat fact
//   const fetchCatFact = async () => {
//     const now = Date.now();
//     if (now - lastFetchTime.catFact < minFetchInterval.catFact) return;

//     try {
//       const response = await fetch("https://catfact.ninja/fact");
//       if (!response.ok) throw new Error("Cat fact fetch failed");
//       const data = await response.json();
//       const fact = data.fact;
//       setCatFact(fact);
//       setLastFetchTime((prev) => ({ ...prev, catFact: now }));
//     } catch (error) {
//       console.error("Error fetching cat fact:", error);
//       setCatFact("Error loading fact");
//     }
//   };

//   // Fetch images from APIs
//   const fetchImages = async () => {
//     const now = Date.now();
//     const newImages = { ...images };

//     // 1. The Cat API (Random)
//     if (now - lastFetchTime.catApi >= minFetchInterval.catApi) {
//       try {
//         const catApiResponse = await fetch("https://api.thecatapi.com/v1/images/search");
//         if (!catApiResponse.ok) throw new Error("The Cat API fetch failed");
//         const catApiData = await catApiResponse.json();
//         if (!catApiData || catApiData.length === 0) throw new Error("No Cat API photos found");
//         console.log("The Cat API response:", catApiData); // เพิ่ม logging
//         newImages.catApi = { url: catApiData[0].url, src: catApiData[0].url };
//         setLastFetchTime((prev) => ({ ...prev, catApi: now }));
//       } catch (error) {
//         console.error("Error fetching The Cat API:", error);
//         newImages.catApi = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     // 2. CATAAS
//     if (now - lastFetchTime.cataas >= minFetchInterval.cataas) {
//       try {
//         const timestamp = new Date().getTime();
//         const cataasUrl = `https://cataas.com/cat?t=${timestamp}`;
//         // ตรวจสอบว่า URL โหลดได้จริง
//         const img = new Image();
//         img.src = cataasUrl;
//         img.onload = () => {
//           newImages.cataas = { url: cataasUrl, src: cataasUrl };
//           setLastFetchTime((prev) => ({ ...prev, cataas: now }));
//           setImages(newImages);
//         };
//         img.onerror = () => {
//           console.error("Error loading CATAAS image:", cataasUrl);
//           newImages.cataas = { url: "https://placehold.co/300x200", src: "Error loading CATAAS image" };
//           setLastFetchTime((prev) => ({ ...prev, cataas: now }));
//           setImages(newImages);
//         };
//       } catch (error) {
//         console.error("Error fetching CATAAS:", error);
//         newImages.cataas = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     // 3. Pexels
//     if (now - lastFetchTime.pexels >= minFetchInterval.pexels) {
//       try {
//         const pexelsResponse = await fetch(
//           "https://api.pexels.com/v1/search?query=cats&per_page=10",
//           {
//             headers: { Authorization: "CxBcXd4YfOt4679s3kpsypY0bk826ai0rDyqAquObNTn7S9JjtDadtOo" },
//           }
//         );
//         if (!pexelsResponse.ok) throw new Error("Pexels fetch failed: " + pexelsResponse.statusText);
//         const pexelsData = await pexelsResponse.json();
//         if (!pexelsData.photos || pexelsData.photos.length === 0) throw new Error("No Pexels photos found");
//         console.log("Pexels response:", pexelsData); // เพิ่ม logging
//         const randomIndex = Math.floor(Math.random() * pexelsData.photos.length);
//         const randomPhoto = pexelsData.photos[randomIndex];
//         newImages.pexels = { url: randomPhoto.src.medium, src: randomPhoto.url };
//         setLastFetchTime((prev) => ({ ...prev, pexels: now }));
//       } catch (error) {
//         console.error("Error fetching Pexels:", error);
//         newImages.pexels = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     // 4. RandomCat API (แทน The Cat API GIF)
//     if (now - lastFetchTime.randomCat >= minFetchInterval.randomCat) {
//       try {
//         const response = await fetch("https://aws.random.cat/meow");
//         if (!response.ok) throw new Error("RandomCat API fetch failed: " + response.statusText);
//         const data = await response.json();
//         if (!data || !data.file) throw new Error("No RandomCat image found");
//         console.log("RandomCat response:", data); // เพิ่ม logging
//         const imageUrl = data.file;
//         // ตรวจสอบว่า URL โหลดได้จริง
//         const img = new Image();
//         img.src = imageUrl;
//         img.onload = () => {
//           newImages.randomCat = { url: imageUrl, src: imageUrl };
//           setLastFetchTime((prev) => ({ ...prev, randomCat: now }));
//           setImages(newImages);
//         };
//         img.onerror = () => {
//           console.error("Error loading RandomCat image:", imageUrl);
//           newImages.randomCat = { url: "https://placehold.co/300x200", src: "Error loading RandomCat image" };
//           setLastFetchTime((prev) => ({ ...prev, randomCat: now }));
//           setImages(newImages);
//         };
//       } catch (error) {
//         console.error("Error fetching RandomCat API:", error);
//         newImages.randomCat = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     // 5. Pixabay
//     if (now - lastFetchTime.pixabay >= minFetchInterval.pixabay) {
//       try {
//         const maxPages = 25;
//         const randomPage = Math.floor(Math.random() * maxPages) + 1;
//         const pixabayResponse = await fetch(
//           `https://pixabay.com/api/?key=49787186-d5fab3da14d29c52084f73c4a&q=cats&image_type=photo&per_page=20&page=${randomPage}`
//         );
//         if (!pixabayResponse.ok) throw new Error("Pixabay fetch failed: " + pixabayResponse.statusText);
//         const pixabayData = await pixabayResponse.json();
//         if (!pixabayData.hits || pixabayData.hits.length === 0) throw new Error("No Pixabay photos found");
//         console.log("Pixabay response:", pixabayData); // เพิ่ม logging
//         const randomIndex = Math.floor(Math.random() * pixabayData.hits.length);
//         newImages.pixabay = {
//           url: pixabayData.hits[randomIndex].webformatURL,
//           src: pixabayData.hits[randomIndex].pageURL,
//         };
//         setLastFetchTime((prev) => ({ ...prev, pixabay: now }));
//       } catch (error) {
//         console.error("Error fetching Pixabay:", error);
//         newImages.pixabay = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     // 6. The Cat API (Random Breed)
//     if (now - lastFetchTime.catApiRandomBreed >= minFetchInterval.catApiRandomBreed) {
//       try {
//         const randomBreed = catBreeds[Math.floor(Math.random() * catBreeds.length)];
//         const catApiRandomBreedResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${randomBreed.id}`);
//         if (!catApiRandomBreedResponse.ok) throw new Error("The Cat API Random Breed fetch failed");
//         const catApiRandomBreedData = await catApiRandomBreedResponse.json();
//         if (!catApiRandomBreedData || catApiRandomBreedData.length === 0) throw new Error("No Random Breed Cat API photos found");
//         console.log("The Cat API Random Breed response:", catApiRandomBreedData); // เพิ่ม logging
//         newImages.catApiRandomBreed = { url: catApiRandomBreedData[0].url, src: catApiRandomBreedData[0].url };
//         setLastFetchTime((prev) => ({ ...prev, catApiRandomBreed: now }));
//       } catch (error) {
//         console.error("Error fetching The Cat API Random Breed:", error);
//         newImages.catApiRandomBreed = { url: "https://placehold.co/300x200", src: "Error" };
//       }
//     }

//     setImages(newImages);
//   };

//   // Periodic fetching with cleanup
//   useEffect(() => {
//     fetchCatFact();
//     fetchImages();

//     const factInterval = setInterval(fetchCatFact, minFetchInterval.catFact);
//     const imageInterval = setInterval(fetchImages, minFetchInterval.catApiRandomBreed);

//     return () => {
//       clearInterval(factInterval);
//       clearInterval(imageInterval);
//     };
//   }, []);

//   // Card list
//   const allCards = [
//     { title: "The Cat API", imgSrc: images.catApi.url, srcLink: images.catApi.src },
//     { title: "CATAAS", imgSrc: images.cataas.url, srcLink: images.cataas.src },
//     { title: "Pexels", imgSrc: images.pexels.url, srcLink: images.pexels.src },
//     { title: "RandomCat API", imgSrc: images.randomCat.url, srcLink: images.randomCat.src }, // เปลี่ยนจาก The Cat API GIF
//     { title: "Pixabay", imgSrc: images.pixabay.url, srcLink: images.pixabay.src },
//     { title: "The Cat API Random Breed", imgSrc: images.catApiRandomBreed.url, srcLink: images.catApiRandomBreed.src },
//   ];

//   const totalPages = Math.ceil(allCards.length / cardsPerPage);
//   const startIndex = (currentPage - 1) * cardsPerPage;
//   const currentCards = allCards.slice(startIndex, startIndex + cardsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="app-container">
//       <nav className="navbar">
//         <h1 className="navbar-title">CAT ta' log</h1>
//       </nav>

//       <div className="grid-container-wrapper">
//         {currentPage > 1 && (
//           <div className="arrow arrow-left" onClick={prevPage}>
//             <div className="arrow-icon arrow-icon-left"></div>
//           </div>
//         )}
//         <div className="grid-container">
//           {currentCards.map((card, index) => (
//             <Card
//               key={index}
//               title={card.title}
//               imgSrc={card.imgSrc}
//               srcLink={card.srcLink}
//             />
//           ))}
//         </div>
//         {currentPage < totalPages && (
//           <div className="arrow arrow-right" onClick={nextPage}>
//             <div className="arrow-icon arrow-icon-right"></div>
//           </div>
//         )}
//       </div>

//       <footer className="footer">
//         <div className="navbar2">
//           <p className="navbar2-text">Cat Fact: {catFact}</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// const Card = ({ title, imgSrc, srcLink }) => (
//   <div className="card">
//     <img src={imgSrc} alt={title} className="card-img" />
//     <p className="card-title">{title}</p>
//     <p className="card-link">
//       Source link:{" "}
//       <a href={srcLink} target="_blank" rel="noopener noreferrer">
//         {srcLink}
//       </a>
//     </p>
//   </div>
// );

// export default App;