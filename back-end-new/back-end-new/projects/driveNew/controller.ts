const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import { Request, Response } from "../../templates/commandInterface";

import DriveNewModel from "../../models/DriveNew";
import Company from "../../models/Company";
import UserModel from "../../models/user";
import general from "../../sharedModules/smallModules/general";

const addDefaultFolders = async (folder: any, type: any, parentFolderName: any) => {
    const defaultFolders = ["IDS", "Home Address Proof", "Employment Contract", "Certificates and Qualifications", "Work References", "Holidays", "Code of Conduct", "Maternity / Paternity", "Disciplinary"]
    // Create folder objects
    const folderObjects = defaultFolders.map(folderName => ({
        folderName: parentFolderName + ' - ' + folderName,
        folder,
        level: 1,
        type
    }));

    // Insert folders with error handling
    try {
        await DriveNewModel.insertMany(folderObjects, { ordered: false });
        console.log('All folders inserted successfully');
    } catch (error) {
        console.error('Some folders failed to insert:', error.insertedDocs);
    }
}
const updateSubfolderLevels = async (parentFolder: any, level: any, type: any, toFolder: any) => {
    let newLevel = 1
    await DriveNewModel.updateMany({ folder: parentFolder._id }, { level: newLevel, type });
    const subfolders = await DriveNewModel.find({ folder: parentFolder._id }).select('_id').lean();
    for (let subfolder of subfolders) {
        if (subfolder._id.toString() == toFolder._id.toString()) {
            await DriveNewModel.updateOne({ _id: toFolder._id }, { level: 0 }).select('_id').lean();
            break;
        } else {
            await updateSubfolderLevels(subfolder, newLevel, type, toFolder);
        }
    }
};

const moveFolder = async (currentFolderId: any, toFolderId: any) => {
    const toFolder = await DriveNewModel.findById(toFolderId);
    const currentFolder = await DriveNewModel.findById(currentFolderId);

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
class DriveNewController {
    async createFile(req: Request, res: Response) {
        try {
            await new DriveNewController().checkAccess(req, res);

            if (req.body.folder) {
                let folder = await DriveNewModel.findOne({ _id: req.body.folder, file: { $exists: false } });
                if (!folder) {
                    throw { message: "Folder Not Found" }
                } else {
                    req.body.level = 1;
                }
            } else if (Array.isArray(req.body)) {
                let result = []
                for (const d of req.body) {
                    if (d.folder) {
                        let folder = await DriveNewModel.findOne({ _id: d.folder, file: { $exists: false } });
                        if (!folder) {
                            throw { message: "Folder Not Found" }
                        } else {
                            d.level = 1;
                        }
                    }
                    let doc = await DriveNewModel.create(d);
                    result.push(doc)
                }
                return res.send({ success: true, message: 'Files Added', data: result })
            }

            if (!Array.isArray(req.body)) {
                let doc = await DriveNewModel.create(req.body);
                return res.send({ success: true, message: 'File Added', data: doc })

            }

        } catch (error) {
            res.send({ success: false, message: error.message })
        }

    }

    async createFolder(req: Request, res: Response) {
        try {
            await new DriveNewController().checkAccess(req, res);

            let doc = await DriveNewModel.create(req.body);
            if (req.body.type == 'Staff Records' && !req.body.folder && req.body.folderName) {
                await addDefaultFolders(doc._id, req.body.type, req.body.folderName)
            }
            res.send({ success: true, message: 'Folder Added', data: doc })

        } catch (error) {
            res.send({ success: false, message: error.message })
        }
    }

    async editFolderName(req: Request, res: Response) {
        try {
            await new DriveNewController().checkAccess(req, res);

            let doc = await DriveNewModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.send({ success: true, message: 'Folder Updated', data: doc })

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }

    async list(req: Request, res: Response) {
        try {
            let isNext = false;
            await new DriveNewController().checkAccess(req, res);

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
            if (req.body.fileName) {
                filter.fileName = req.body.fileName
            }
            if (req.body.type) {
                filter.type = req.body.type
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

            const data = await DriveNewModel.aggregate([
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
            await new DriveNewController().checkAccess(req, res);

            let filter: any = { file: { $exists: false }, folderName: { $exists: true }, isDelete: { $ne: true } }
            const searchKeys = ['folderName', 'type', 'folder']
            await general.addSearchFilterWithOr(filter, searchKeys, req.query.search)


            // let skipNumber = 0;
            // let limitNumber = 10;
            // if (req.body.skip) skipNumber = Number(req.body.skip);
            // if (req.body.limit) limitNumber = Number(req.body.limit);

            const data = await DriveNewModel.aggregate([
                {
                    $match: filter,
                },
                general.addLookup('drivenews', 'folder', '_id', ['folderName'], 'folder', false),
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
            await new DriveNewController().checkAccess(req, res);
            general.checkIdValidation(req.body, ['currentFolderId', 'toFolderId']);
            const result = await moveFolder(req.body.currentFolderId, req.body.toFolderId);
            res.send(result);

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }

    async deleteFile(req: Request, res: Response) {
        try {
            await new DriveNewController().checkAccess(req, res);

            let data = await DriveNewModel.updateOne({ _id: req.params.id, file: { $exists: true } }, { isDelete: true });

            res.send({ success: true, message: "file deleted" })

        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }

    async deleteFolder(req: Request, res: Response) {
        try {
            await new DriveNewController().checkAccess(req, res);

            let folderCount = await DriveNewModel.countDocuments({
                folder: req.params.id,
                file: { $exists: true }
            });

            if (folderCount > 0) {
                throw { message: "Folder has files in it, please delete them first" }
            } else {
                let data = await DriveNewModel.updateOne({ _id: req.params.id, file: { $exists: false } }, { isDelete: true });
                await DriveNewModel.updateMany({ folder: req.params.id }, { isDelete: true })
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

export default new DriveNewController()
