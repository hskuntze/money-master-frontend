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
