exports.addNewSiteAdmin = (req: any, res: any, next: () => void) => {
    next();
};

exports.addNewConfig = (req: { body: { receiver: any; test: any; }; }, res: any, next: () => void) => {
    req.body.receiver = req.body.test;
    next();
};

exports.listRegUser = (req: { body: { sender: any; }; params: { categoryName: any; }; }, res: any, next: () => void) => {
    req.body.sender = req.params.categoryName;
    next();
};
