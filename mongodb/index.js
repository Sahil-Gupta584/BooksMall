import mongoose from 'mongoose'

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error, 'error in dbConnect');
        throw error
    }
}

