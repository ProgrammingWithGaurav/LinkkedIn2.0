import mongoose, { Schema, Document, models, Model } from 'mongoose';
import {IUser} from '../../types/user';
import {  Comment,IComment, ICommentBase } from './comment';

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl ?: string;
    comments ?: IComment[];
    likes?: string[];
}

export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods { } // for single post
interface IPostModel extends Model<IPostDocument>, IPostStatics { }     // for all posts


const postSchema = new Schema<IPostDocument>({
    user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: {type: [Schema.Types.ObjectId], ref: 'Comment', default: []},
    likes: {type: [String]}
}, {
    timestamps: true 
})

postSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({$addToSet: {likes: userId}})
    } catch (error) {
        console.log('Failed to like the post',error);
    }
}

postSchema.methods.unlikePost = async function (userId: string) {
    try {
        await this.updateOne({$pull: {likes: userId}})
    } catch (error) {
        console.log('Failed to unlike the post',error);
    }
}

postSchema.methods.removePost = async function () {
    try {
        await this.model('Post').deleteOne({_id: this._id})
    } catch (error) {
        console.log('Failed to remove the post',error);
    }
}


postSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase){
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments.push(comment._id);
        await this.save();
    }  catch (error) {
        console.log('Failed to comment on the post',error);
    }
}

postSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments", 
            options: {sort: {createdAt: -1}} // sort comment by newest first
        });
        return this.comments;
    } catch (error){
        console.log('Failed to get comments',error);
    }
}

postSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find().sort({ createdAt: -1 }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }
        }).lean(); // lean() to get plain JS object instead of mongoose document

        return posts.map((post: IPostDocument) => ({
            ...post,
            _id:(post._id as any).toString(),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: (comment._id as any).toString()
       
            }))
        }));
    } catch (error) {
        console.log('Failed to get all posts',error);
    }
}

export const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", postSchema);
 