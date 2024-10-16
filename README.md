# BooksMall: Marketplace for Second-Hand Books 📚

Welcome to **BooksMall**, a marketplace dedicated to second-hand books! This project allows users to buy, sell, and communicate with sellers in real time, making it easier than ever to find great deals on pre-loved literature. 💬

## Features 🌟

- **Real-Time Chat:** Powered by Socket.IO, our chat system enables seamless communication between buyers and sellers, ensuring quick and efficient interactions. 🗨️
- **Browse by Categories:** Easily explore a wide variety of book categories to find what you’re looking for. 📖
- **Detailed Listings:** View comprehensive details for each book listing, including condition, price, and seller information. 📝
- **Personalized Recommendations:** Get tailored suggestions based on your search history to discover new books that might interest you. 🎯

## Getting Started 🚀

This project was initially created as a practice endeavor, but I believe it’s now ready to be shared with the world!

### Live Demo 🌐

You can check out the deployed version of BooksMall [here](https://books-mall.vercel.app/).

### Installation 🛠️

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sahil-Gupta584/BooksMall.git
   cd BooksMall
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result. You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

### Running with Docker 🐳

If you prefer to use Docker, follow these steps:

1. **Build the Docker image:** 
   In the root of your project, run the following command to build the Docker image:

   ```bash
   docker build -t booksmall-app .
   ```

2. **Run the Docker container:** 
   Once the image is built, run the container with the following command:

   ```bash
   docker run -p 3000:3000 booksmall-app
   ```

3. **Access the application:** 
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the app running inside the Docker container.

### Issues and Contributions 🤝

I encourage you to explore the deployed version and check for any issues. Please feel free to raise issues or submit pull requests (PRs). Your contributions to improve the platform and documentation are greatly appreciated!

### Documentation 📜

Documentation improvements are welcome! If you have suggestions or want to help enhance the project's documentation, please don’t hesitate to reach out.

## Technologies Used 💻

- **Frontend:**
  - Next.js
  - React.js
  - Redux for state management
  - Tailwind CSS for styling
  - Axios for API calls

- **Backend:**
  - Node.js with Express.js
  - Socket.IO for real-time communication
  - MongoDB for the database

- **Development Tools:**
  - Git and GitHub for version control
  - npm/yarn for package management

## 🎉 Hacktoberfest 2024

BooksMall is proud to be a part of **Hacktoberfest 2024**!  
We encourage developers and open-source enthusiasts to contribute to our project as part of Hacktoberfest, a month-long celebration of open-source contributions during October.  
Come and join us to make an impact in the real world while learning and growing your skills in software development!

### How to Contribute:

- Fork and star the repository and submit a pull request.
- All contributions are welcome, from bug fixes to adding new features.
- Make sure your PR follows the contribution guidelines.

## Deploy on Vercel ☁️

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).  

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙏

Thank you for checking out BooksMall! Happy reading and happy selling! 📚
