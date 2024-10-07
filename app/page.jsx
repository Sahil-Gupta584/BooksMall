import { categories } from "./resource";
import ShowCards from "./components/showCards";
import ThemeToggle from "./components/ThemeToggle"; // Importing the ThemeToggle component

export default function Home() {
  console.log(process.env.API_KEY);
  return (
    <>
      {/* Header Section */}
      <div className="header-container flex justify-between items-center py-4 px-6">
        <h1 className="text-xl">Welcome to Books Mall</h1>
        {/* Add the ThemeToggle Button here in the header */}
        <ThemeToggle />
      </div>
      
      {/* Browse by Categories Section */}
      <div className="category-container">
        <div className="flex items-center gap-2 px-3 py-5">
          <div className="flex-1 h-[2px] bg-[grey] w-[23%]"></div>
          <p className="lg:text-[2vw] md:text-[1rem]">Browse by categories</p>
          <div className="flex-1 h-[2px] bg-[grey] w-[23%]"></div>
        </div>
        
        <div className="categories flex">
          {categories.map((e, i) => (
            <div className="category-card text-center" key={i}>
              <a href={`/collections/${e.name}`}>
                <img
                  className="m-auto w-[50%] max-w-[77.8056px]"
                  src={e.src.src}
                  alt={e.name}
                />
              </a>
              <p className="text-center">{e.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      <ShowCards />
    </>
  );
}
