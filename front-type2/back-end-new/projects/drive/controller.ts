const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import { Request, Response } from "../../templates/commandInterface";

import DriveModel from "../../models/Drive";
import Company from "../../models/Company";
import UserModel from "../../models/user";
import general from "../../sharedModules/smallModules/general";
import { CONSUMER_ROLE_ID } from "../../sharedModules/constants/roleId";

const addDefaultFolders = async (Consumer: any) => {
    const defaultFolders = ["RA FILES", "RC FILES", "Installation documents", "REMEDIAL PHOTOS", "Post Install Pics"];
    const newFolder = new DriveModel({ folderName: "ECO4", level: 0, Consumer });
    await newFolder.save();

    const folderObjects = defaultFolders.map(folderName => ({
        Consumer,
        folderName: folderName,
        folder: newFolder._id,
        level: 1,
    }));

    try {
        await DriveModel.insertMany(folderObjects, { ordered: false });
        console.log('All folders inserted successfully');
    } catch (error) {
        console.error('Some folders failed to insert:', error.insertedDocs);
    }
}
const updateSubfolderLevels = async (parentFolder: any, level: any, type: any, toFolder: any) => {
    let newLevel = 1
    // await DriveModel.updateMany({ folder: parentFolder._id }, { level: newLevel, type });
    const subfolders = await DriveModel.find({ folder: parentFolder._id }).select('_id').lean();
    for (let subfolder of subfolders) {
        if (subfolder._id.toString() == toFolder._id.toString()) {
            await DriveModel.updateOne({ _id: toFolder._id }, { level: 0 }).select('_id').lean();
            break;
        }
        else {
            await updateSubfolderLevels(subfolder, newLevel, type, toFolder);
        }
    }
};

const moveFolder = async (currentFolderId: any, toFolderId: any) => {
    const toFolder = await DriveModel.findById(toFolderId);
    const currentFolder = await DriveModel.findById(currentFolderId);


    if (currentFolder == toFolder) {
        throw new Error('Current folder and to folder are same');
    }
    if (!currentFolder) {
        throw new Error('Current folder not found');
    }

    if (!toFolder) {
        throw new Error('Destination folder not found');
    }

    // Calculate the new level for the current folder
    const newLevel = 1; //only two levels 0 and 1
    const newType = toFolder.type;

    // Update the parentId and level of the current folder
    currentFolder.folder = toFolder._id;
    currentFolder.level = newLevel;
    currentFolder.type = newType;
    await currentFolder.save();

    // Update levels of all subfolders recursively

    await updateSubfolderLevels(currentFolder, newLevel, newType, toFolder);

    return { success: true, message: 'Moved Successfully' };
};
class DriveController {
    async createFile(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);

            if (req.body.folder) {
                let folder = await DriveModel.findOne({ _id: req.body.folder, file: { $exists: false } });
                if (!folder) {
                    throw { message: "Folder Not Found" }
                } else {
                    req.body.level = 1;
                }
            } else if (Array.isArray(req.body)) {
                let result = []
                for (const d of req.body) {
                    if (d.folder) {
                        let folder = await DriveModel.findOne({ _id: d.folder, file: { $exists: false } });
                        if (!folder) {
                            throw { message: "Folder Not Found" }
                        } else {
                            d.level = 1;
                        }
                    }
                    let doc = await DriveModel.create(d);
                    result.push(doc)
                }
                return res.send({ success: true, message: 'Files Added', data: result })
            }

            if (!Array.isArray(req.body)) {
                let doc = await DriveModel.create(req.body);
                return res.send({ success: true, message: 'File Added', data: doc })

            }

        } catch (error) {
            res.send({ success: false, message: error.message })
        }

    }

    async createFolder(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);

            let doc = await DriveModel.create(req.body);
            res.send({ success: true, message: 'Folder Added', data: doc })

        } catch (error) {
            res.send({ success: false, message: error.message })
        }
    }

    async editFolderName(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);

            let doc = await DriveModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.send({ success: true, message: 'Folder Updated', data: doc })

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }

    async list(req: Request, res: Response) {
        try {
            let isNext = false;
            await new DriveController().checkAccess(req, res);

            let filter: any = { isDelete: { $ne: true } }

            if (req.body.Company) {
                filter.Company = ObjectId(req.body.Company)
            }
            if (req.body.Consumer) {
                filter.Consumer = ObjectId(req.body.Consumer)
            }
            if (req.body.folder) {
                filter.folder = ObjectId(req.body.folder)
            }
            if (req.body.level) {
                filter.level = Number(req.body.level)
            } else {
                filter.level = 0;
            }

            let skipNumber = 0;
            let limitNumber = 10;
            if (req.body.skip) skipNumber = Number(req.body.skip);
            if (req.body.limit) limitNumber = Number(req.body.limit);

            const data = await DriveModel.aggregate([
                {
                    $match: filter,
                },
                { $skip: skipNumber },
                { $limit: limitNumber },
            ])

            if (data.length === limitNumber) {
                isNext = true;
            }

            res.send({ data, isNext, count: data.length, success: true });


        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }
    async listAll(req: Request, res: Response) {
        try {
            let isNext = false;
            await new DriveController().checkAccess(req, res);

            let filter: any = { file: { $exists: false }, folderName: { $exists: true }, isDelete: { $ne: true } }

            if (!req.body.Company && !req.body.Consumer) {
                return res.send({ success: false, message: "Company Or Consumer is required" })

            }
            if (req.body.Company) {
                filter.Company = ObjectId(req.body.Company)
            }
            if (req.body.Consumer) {
                filter.Consumer = ObjectId(req.body.Consumer)
            }
            const searchKeys = ['folderName', 'type', 'folder']
            await general.addSearchFilterWithOr(filter, searchKeys, req.query.search)


            // let skipNumber = 0;
            // let limitNumber = 10;
            // if (req.body.skip) skipNumber = Number(req.body.skip);
            // if (req.body.limit) limitNumber = Number(req.body.limit);

            const data = await DriveModel.aggregate([
                {
                    $match: filter,
                },
                general.addLookup('drives', 'folder', '_id', ['folderName'], 'folder', false),
                general.addUnwind('folder', true),
                // { $skip: skipNumber },
                // { $limit: limitNumber },
            ])

            // if (data.length === limitNumber) {
            //     isNext = true;
            // }

            res.send({ data, isNext, count: data.length, success: true });


        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }
    async moveFolder(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);
            general.checkIdValidation(req.body, ['currentFolderId', 'toFolderId']);
            const result = await moveFolder(req.body.currentFolderId, req.body.toFolderId);
            res.send(result);

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }
    async addDefaultFolderConsumer(Consumer: any) {
        try {
            // await new DriveController().checkAccess(req, res);
            // general.checkIdValidation(req.body, ['currentFolderId', 'toFolderId']);
            const result = await addDefaultFolders(Consumer);
            // res.send(result);

        } catch (error) {
            // res.send({ success: false, message: error.message })

        }
    }
    async addDefaultFolderScript(req: Request, res: Response) {
        try {
            let skip = req.query.skip ? parseInt(req.query.skip) : 0;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const consumers = await UserModel.find({ role: CONSUMER_ROLE_ID }).skip(skip).limit(limit).lean();

            const newFolders = [];

            const tasks = consumers.map(async (consumer, index) => {
                let checkFolder = await DriveModel.findOne({ Consumer: consumer._id, folderName: 'ECO4' });
                if (checkFolder) {
                    console.log(`Added >>>>>>>>----------------->\n: ${index}, consumer._id: ${consumer._id}`);
                    // await addDefaultFolders(consumer);
                    const newFolder = {
                        Consumer: consumer._id,
                        folderName: "Post Install Pics",
                        folder: checkFolder._id,
                        level: 1,
                    };
                    newFolders.push(newFolder);
                }
            });

            await Promise.all(tasks);

            if (newFolders.length > 0) {
                await DriveModel.insertMany(newFolders);
            }

            res.send({ success: true, message: "Done", length: consumers.length });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }
    async deleteFile(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);

            let data = await DriveModel.updateOne({ _id: req.params.id, file: { $exists: true } }, { isDelete: true });

            res.send({ success: true, message: "file deleted" })

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }

    async deleteFolder(req: Request, res: Response) {
        try {
            await new DriveController().checkAccess(req, res);

            let folderCount = await DriveModel.countDocuments({
                folder: req.params.id,
                file: { $exists: true }
            });

            if (folderCount > 0) {
                throw { message: "Folder has files in it, please delete them first" }
            } else {
                let data = await DriveModel.updateOne({ _id: req.params.id, file: { $exists: false } }, { isDelete: true });
                await DriveModel.updateMany({ folder: req.params.id }, { isDelete: true })

                res.send({ success: true, message: "Folder Deleted" })
            }
        } catch (error) {
            res.send({ success: false, message: error.message })
        }
    }

    async checkAccess(req: Request, res: Response) {

        if (['5d5b91e01c9d440000c9990f', '5d5b92031c9d440000c99914'].includes(req.user.role.toString())) {
            return true;
        } else if (['5d5b92031c9d440000c99911', '5d5b92031c9d440000c99912', '5d5b91db1c9d440000c9991d', '608f9c0adec79b10729cc88d', '62a8266b193c318de458db58', '62b02a8fda27b400c8b8cf1e'].includes(req.user.role.toString())) {
            if (req.body.Company) {
                let com = await Company.findOne({ _id: req.body.Company, Assignee: req.user._id }).select('businessName').lean();
                if (!com) {
                    throw { message: 'Access Denied' }
                }
            } else if (req.body.Consumer) {
                let con = await UserModel.findOne({ _id: req.body.Consumer, Assignee: req.user._id }).select('email').lean();
                if (!con) {
                    throw { message: 'Access Denied' }

                }
            }
            return true;
        }

    }
}

export default new DriveController()
