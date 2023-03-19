import React, { FC } from "react";
import moment from "moment";
import { toast } from "react-toastify";

import { AdCampaignProps } from "../services/DataProvider";
import style from "./AdListsCard.module.scss";
import { deleteAdCampaign } from "../services/API";

interface AdListsCardProps {
  adItems: AdCampaignProps;
  adCampaignLists?: () => void;
}

const AdListsCard: FC<AdListsCardProps> = ({ adItems, adCampaignLists }) => {
  /****************************************/
  /******* Delete Ad Campaign  ************/
  /****************************************/

  const onClickDeleteAdCampaign = async () => {
    try {
      const res = await deleteAdCampaign(adItems._id);

      if (res) {
        toast.success("Ad Deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        adCampaignLists?.();
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className={style.cardContainer}>
      <div className="row">
        <div className="col-xl-2 col-lg-1 col-md-12 col-sm-6">
          <h6>{moment(adItems.ad_date).format("MMM Do YY")}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.attributed_conversions}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.attributed_revenue}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.optimisation_target}</h6>
        </div>
        <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.partition_id.substring(0, 20)}</h6>
        </div>
        <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.source.substring(0, 20)}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.spends}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <h6>{adItems.type}</h6>
        </div>
        <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
          <button className="btn btn-danger" onClick={onClickDeleteAdCampaign}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdListsCard;
