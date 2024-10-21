import mongoose from 'mongoose'

export async function dbConnect() {
    try {
        console.log('mongouri', process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });
        const dbres = await mongoose.connect(process.env.MONGO_URI)
        // console.log('dbres:', dbres);

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error, 'error in dbConnect');
        throw error
    }
}

