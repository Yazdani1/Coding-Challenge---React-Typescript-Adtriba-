import axios from "axios";
import { API_URL } from "./Config";
import {AdCampaignType,AdCampaignOptimisation_Target} from "./DataProvider"; 

/****************************************/
/******* Ad Campaign          ***********/
/****************************************/

export interface CreateAdCampaignProps {
  ad_date: string;
  source: string;
  attributed_conversions:number;
  attributed_revenue:number;
  type:AdCampaignType;
  spends:number;
  partition_id: string;
  optimisation_target:AdCampaignOptimisation_Target
}

export const createAdCampaign = async (props: CreateAdCampaignProps) => {
  const res = await axios.post(API_URL + "/create-adcampaign", { ...props });
  return res;
};

export const getAdCampaignLists = async () => {
  const res = await axios.get(API_URL + "/ad-capmaign-lists");
  return res;
};

export const deleteAdCampaign = async(id:string)=>{

  const res = await axios.delete(API_URL+"/delete-add-campaign/"+id);
  return res;

}
