/* eslint-disable @typescript-eslint/no-explicit-any */
export function decimalToNumber(this: any) {
  const obj = this.toObject ? this.toObject() : this;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && (v as any)._bsontype === "Decimal128") {
      (obj as any)[k] = Number((v as any).toString());
    } else if (v && typeof v === "object" && v !== null) {
      try {
        (obj as any)[k] = decimalToNumber.call(v);
      } catch {}
    }
  }
  return obj;
}
