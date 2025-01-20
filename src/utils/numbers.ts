import { CDPDetails, CDPInfo } from "../types/cdp.types";
import { IlkType } from "../types/store.types";
import { bytesToString } from "./bytes";
import { collateralDetails } from "./constants";

export function formatToDecimals(num: number, decimal = 4): number {
  return Number(num.toFixed(decimal));
}

export function bigIntToNum(num: bigint): number {
  return formatToDecimals(Number(num) / 1e18);
}

function calculateLiquidationPrice(
  debt: number,
  collateral: number,
  ilk: IlkType
): number {
  if (debt === 0 && collateral === 0) return 0;
  const collateralDetail = collateralDetails[ilk];
  const liquidationPrice =
    debt / (collateral / collateralDetail.liquidationRatio);

  return formatToDecimals(liquidationPrice);
}

function calculateCollateralizationRatio(
  debt: number,
  collateral: number,
  ilk: IlkType
): number {
  if (debt === 0 || collateral === 0) return 0;
  const collateralDetail = collateralDetails[ilk];
  const collateralValueInDAI = collateral * collateralDetail.price;
  const collateralizationRatio = (collateralValueInDAI / debt) * 100;

  return formatToDecimals(collateralizationRatio, 2);
}

function calculateMaxWithdrawable(
  debt: number,
  collateral: number,
  ilk: IlkType
): number {
  const collateralDetail = collateralDetails[ilk];
  const currentCollateralValue = collateral * collateralDetail.price;
  const minSafeCollateralValue = debt * collateralDetail.liquidationRatio;
  const withdrawableValue = Math.max(
    currentCollateralValue - minSafeCollateralValue,
    0
  );

  return formatToDecimals(withdrawableValue / collateralDetail.price);
}

function calculateMaxDebt(
  debt: number,
  collateral: number,
  ilk: IlkType
): number {
  const collateralDetail = collateralDetails[ilk];
  const collateralValue = collateral * collateralDetail.price;
  const maxSafeDebt = collateralValue / collateralDetail.liquidationRatio;
  const additionalDebt = Math.max(maxSafeDebt - debt, 0);

  return formatToDecimals(additionalDebt);
}

export const getCDPDetails = (cdp: CDPInfo, rate: number): CDPDetails => {
  const debt = formatToDecimals(bigIntToNum(BigInt(cdp.debt)) * rate);
  const collateral = bigIntToNum(BigInt(cdp.collateral));
  const ilk = bytesToString(cdp.ilk) as IlkType;

  return {
    maxDebt: calculateMaxDebt(debt, collateral, ilk),
    maxWithdraw: calculateMaxWithdrawable(debt, collateral, ilk),
    collateralRatio: calculateCollateralizationRatio(debt, collateral, ilk),
    liquidationPrice: calculateLiquidationPrice(debt, collateral, ilk),
    debt,
    collateral,
    ilk,
  };
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatCurrencyIntl(number: number): string {
  return formatter.format(number);
}
