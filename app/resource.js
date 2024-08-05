import Adventure from "../public/categories-img/Adventures.webp";
import Biography from "../public/categories-img/Biography.webp";
import ClassicNovels from "../public/categories-img/ClassicNovels.webp";
import CoffeeTable from "../public/categories-img/CoffeeTable.png";
import Fantasy from "../public/categories-img/Fantasy.webp";
import Horror from "../public/categories-img/Horror.webp";
import Manga from "../public/categories-img/Manga.webp";
import Mystery from "../public/categories-img/Mystery.webp";
// import BooksCombo from "../public/categories-img/BooksCombo.webp";
import Philosophy from "../public/categories-img/Phylosophy.webp";
import Romance from "../public/categories-img/Romance.png";
import ScienceFiction from "../public/categories-img/ScienceFiction.webp";
import SelfHelp from "../public/categories-img/SelfHelp.webp";
import YoungAdult from "../public/categories-img/YoungAdult.webp";

export const categories = [
    { name: 'Adventures', src: Adventure },
    { name: 'Biography', src: Biography },
    { name: 'Classic Novels', src: ClassicNovels },
    { name: 'Coffee Table', src: CoffeeTable },
    { name: 'Fantasy', src: Fantasy },
    { name: 'Horror', src: Horror },
    { name: 'Manga', src: Manga },
    { name: 'Mystery', src: Mystery },
    // { name: 'Books Combo', src: BooksCombo },
    { name: 'Philosophy', src: Philosophy },
    { name: 'Romance', src: Romance },
    { name: 'Science Fiction', src: ScienceFiction },
    { name: 'Self Help', src: SelfHelp },
    { name: 'Young Adult', src: YoungAdult }
];

export function getTimeElapsed(timestamp) {
    const now = new Date();
    const postedDate = new Date( Number(timestamp));
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    
    return postedDate.toLocaleDateString();
}