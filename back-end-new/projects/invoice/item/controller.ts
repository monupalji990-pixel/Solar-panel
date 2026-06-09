import ItemModel, { ItemSelectFields } from "./item";
import { Request, Response } from "../../../templates/commandInterface";
import general from "../../../sharedModules/smallModules/general";
import commonUtils from "../../../sharedModules/smallModules/commanUtils";


class RegUserController {
    async list(req: Request, res: Response) {
        try {
            let filter: any = {};

            const searchKeys = ['title']
            await general.addSearchFilterWithOr(filter, searchKeys, req.query.Search)

            let aggregatePipeline: any = [{ $match: filter },
            { $project: ItemSelectFields }];

            const { data, isNext } = await general.execWithCommonAggregate(ItemModel, aggregatePipeline, req.query);

            res.send({ success: true, isNext, data });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async add(req: Request, res: Response) {
        try {
            general.checkKeyValidation(req.body, ['title', 'price']);
            const obj = new ItemModel(req.body);
            obj.createdBy = req.user._id
            await obj.save();

            res.send({ success: true, message: "Added successfully" });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async edit(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);
            const data = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
            res.send({ success: true, message: 'Updated successfully' });

        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async get(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);

            const data = await ItemModel.findById( req.params.id )
            res.send({ success: true, data });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async delete(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);

            await ItemModel.findByIdAndDelete({ _id: req.params.id })
            res.send({ success: true, message: "Deleted successfully" });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }


}

export default class AllControllers {
    Reguser: RegUserController
    constructor() {
        this.Reguser = new RegUserController();
    }
}

