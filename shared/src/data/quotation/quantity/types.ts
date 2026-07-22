export interface SubRowDef {
  sl: string;
  desc: string;
  spec: string;
  unit: string;
  addlSpec?: string;
  addlUnit?: string;
  addlField?: string;
  purchField?: string;
  defaultQty?: string | number;
  isCalculated?: boolean;
}

export interface RowDef {
  sl: string;
  labelPrefix?: string;
  labelSuffix?: string;
  label: string;
  spec: string;
  specValue?: string;
  unit: string;
  addlSpec?: string;
  addlUnit?: string;
  qtyField: string;
  unitField: string | null;
  defaultQty?: string | number;
  isCalculated?: boolean;
  subRows: SubRowDef[];
}
