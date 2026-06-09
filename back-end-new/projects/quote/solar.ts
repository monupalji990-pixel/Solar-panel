import { Request, Response } from "../../templates/commandInterface";
import commanUtils from "../../sharedModules/smallModules/commanUtils";
import axios from 'axios';
import ConfigModel from "../config/config";
import UserModel from "../../models/user";
import CompanyModel from "../../models/Company";

let OPEN_SOLAR_URL = 'https://api.opensolar.com'

let SolarTypes = [
"Composition / Asphalt Shingle",
"Flat Concrete",
"Flat Foam",
"Membrane EPDM",
"Membrane PVC",
"Membrane TPO",
"Metal Decramastic",
"Metal Shingle",
"Metal Standing Seam",
"Metal Stone Coated",
"Metal Tin",
"Tar and Gravel / Bitumen",
"Thatched",
"Tile Clay",
"Tile Concrete",
"Tile Slate",
"Wood/Shake Shingle",
"Other",
"Kliplock",
]

class SolarController {
    async getToken(){
        try {
            
            let config = await ConfigModel.findOne({
                token:{$exists:true}
            })

            // use old token
            if(config && config.token_expires > new Date()){
                return config;    
            }


           let data:any = await axios.post("https://api.opensolar.com/api-token-auth/",{
            "username":"meetsinh3@gmail.com",
            "password":"Powerfly@2021"
           }) 

           await ConfigModel.deleteMany({})

           config = await ConfigModel.create({
            data:data.data,
            token: data.data.token,
            token_expires: new Date(new Date().setDate(new Date().getDate() + 5))
           })

           return config;
        } catch (error) {
            console.log(error)
            commanUtils.sendErrorResponse(null, null, error);

        }
    }

    async createProject(quoteData:any,leadData:any,coOrdinates:any){
        try {
            let config = await new SolarController().getToken()
            let solarProject:any = {}

            if(quoteData?.Consumer){
                const ConsumerInfo = await UserModel.findOne({ _id: quoteData.Consumer });
                solarProject ={
                // "identifier": "", //?,
                "is_residential": "1",  //?
                "lead_source": leadData.source,
                "notes": leadData.notes,
                // "lat": "35.12364",
                // "lon": "128.23216",
                "address": ConsumerInfo.addressOne + ', '+ConsumerInfo.addressTwo,
                // "locality": "",
                // "state": "",
                // "country_iso2": "AU",
                "zip": ConsumerInfo.postcode,
                // "number_of_phases": "1",
                // "roof_type": "https://api.opensolar.com/api/roof_types/6/", ?
                // "assigned_role": "https://api.opensolar.com/api/orgs/1/roles/123/", // assigned_installer_role and assigned_site_inspector_role also available
                "contacts_new": [
                    {
                      "first_name": ConsumerInfo.firstName,
                      "family_name": ConsumerInfo.surName,
                      "email": ConsumerInfo.email,
                      "phone": ConsumerInfo.mobile,
                    //   "date_of_birth": "1990-01-01",
                    //   "gender": "2" // 0 = unset, 1 = female, 2 = male
                    }
                  ]
                }
                
              
            }else if(quoteData?.Company){
                 const CompanyInfo = await CompanyModel .findOne({ _id: quoteData.Company });
                 solarProject={
                    // "identifier": "", //?,
                    "is_residential": "0",  //?
                    "lead_source": leadData.source,
                    "notes": leadData.notes,
                    // "lat": "35.12364",
                    // "lon": "128.23216",
                    "address": CompanyInfo.firstLine + ', '+CompanyInfo.secondLine,
                    // "locality": "",
                    // "state": "",
                    // "country_iso2": "AU",
                    "zip": CompanyInfo.postcode,
                    // "number_of_phases": "1",
                    // "roof_type": "https://api.opensolar.com/api/roof_types/6/", ?
                    // "assigned_role": "https://api.opensolar.com/api/orgs/1/roles/123/", // assigned_installer_role and assigned_site_inspector_role also available
                    "contacts_new": [
                        {
                          "first_name": CompanyInfo.businessName,
                        //   "family_name": CompanyInfo.surName,
                          "email": CompanyInfo.email,
                          "phone": CompanyInfo.mobile,
                        //   "date_of_birth": "1990-01-01",
                        //   "gender": "2" // 0 = unset, 1 = female, 2 = male
                        }
                      ]
                    }
            }

            if(coOrdinates.lat){
                solarProject.lat = coOrdinates.lat 
            }

            if(coOrdinates.lon){
                solarProject.lon = coOrdinates.lon 
            }
            let data:any = await axios.post(OPEN_SOLAR_URL+`/api/orgs/${config.data.org_id}/projects/`,solarProject,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })
            console.log(data.data)
            quoteData.OpenSolarProjectId = data.data.id
            quoteData.OpenSolarProjectUrl = data.data.url

            await quoteData.save();
            return
        } catch (error) {
            console.log(error.response.data)
            // commanUtils.sendErrorResponse(null,null, error);

        }
    }

    async getProject(req:any,res:Response){        
        try {
            // req.params.project=2801453
            let config = await new SolarController().getToken()
            let data = await axios.get(OPEN_SOLAR_URL+`/api/orgs/${config.data.org_id}/projects/${req.params.project}`,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })
            return data.data;
        } catch (error) {
            console.log(error)
            commanUtils.sendErrorResponse(req, res, error);
        }
    }

    async listProject(req:Request,res:Response){
        try {
            let page = Number(req.query.page) || 0
            let limit = Number(req.query.limit) || 0

            let config = await new SolarController().getToken()
            let data = await axios.get(
                OPEN_SOLAR_URL+`/api/orgs/${config.data.org_id}/projects/${req.params.project}`,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })

        } catch (error) {
            console.log(error)
            commanUtils.sendErrorResponse(req, res, error);
        }
    }

    async getSystemDetails(req:Request,res:Response){
        try {
            let config = await new SolarController().getToken()
            let data = await axios.get(OPEN_SOLAR_URL+`/api/orgs/${config.data.org_id}/projects/${req.params.project}/systems/details/`,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })

            return res.send({success:true,data:data.data})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    async getSystemImage(req:Request,res:Response){
        try {
            let config = await new SolarController().getToken()
            let data = await axios.get(OPEN_SOLAR_URL+`/api/orgs/${config.data.org_id}/projects/${req.params.project}/systems/${req.params.uuid}/image/`,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })
            return res.send({success:true,data:data.data})

        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    async getDataFromUrl(req:Request,res:Response){
        console.log("url ", req.body, req.body.url)
        try {
            let config = await new SolarController().getToken()
            let data = await axios.get(req.body.url,{
                headers:{
                    'Authorization': 'Bearer '+config.token
                }
            })
            return res.send({success:true,data:data.data})

        } catch (error) {
            console.log(error)
           return res.send(error.message)
        }
    }
}


export default new SolarController();