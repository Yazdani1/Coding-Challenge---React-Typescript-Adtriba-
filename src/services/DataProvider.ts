interface IBase {
  _id: string;
}

// Type of ad campaign

export enum AdCampaignType {
  incrementality = "incrementality",
  baseline = "baseline",
}

// Converstaiton ad campaign

export enum AdCampaignOptimisation_Target {
  conversions = "conversions",
  revenue = "revenue",
}

export interface AdCampaignProps extends IBase {
  ad_date: string;
  source: string;
  attributed_conversions:number;
  attributed_revenue:number;
  type:AdCampaignType;
  spends:number;
  partition_id: string;
  optimisation_target:AdCampaignOptimisation_Target
}


export interface AdCampaignExcelDataProps extends IBase {
  date:string,
  source:string,
  attributed_conversions:number,
  attributed_revenue:number,
  type:string,
  spends:number,
  partition_id:number,
  optimisation_target:string
}


/****************************************/
/*** Chart Types                   ******/
/****************************************/

export enum ChartTypes {
  Line_Chart = "Line_Chart",
  Area_Chart = "Area_Chart",
  Bar_Chart = "Bar_Chart",
  Line_Bar_Area_Composed_Chart = "Line_Bar_Area_Composed_Chart",
}

