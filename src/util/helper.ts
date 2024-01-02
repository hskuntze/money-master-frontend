import { BasicTEBM } from "types/charts/basictebm";
import { SumByDateType } from "types/charts/sumbydate";
import { SumByTitleType } from "types/charts/sumbytitle";

export const buildSumByTitle = (objs: SumByTitleType[], objName: string) => {
  const name = objName;
  const labels = objs.map((obj) => obj.title);
  const series = objs.map((obj) => obj.sum);

  return {
    name,
    labels,
    series,
  };
};

export const buildSumByDate = (objs: SumByDateType[]) => {
  return objs.map((obj) => ({
    x: obj.dateOfCharge,
    y: obj.sum,
  }));
};

export const buildBasicTebmData = (objs: BasicTEBM[]) => {
  return objs.map((obj) => ({
    x: obj.date,
    y: obj.totalExpended,
  }));
};
