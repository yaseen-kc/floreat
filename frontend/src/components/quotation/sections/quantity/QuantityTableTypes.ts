export interface SubRowDef {
  sl: string;
  desc: string;
  spec: string;
  unit: string;
  addlSpec?: string;
  addlUnit?: string;
  addlField?: string;
  purchField?: string;
}

export interface RowDef {
  label: string;
  spec: string;
  unit: string;
  qtyField: string;
  unitField: string | null;
  subRows: SubRowDef[];
}
