export type CodeResult = {
  code: string
  format: string
  decodedCodes: DecodeCode[]
  boxes: unknown
}

export type Result = {
  codeResult: CodeResult
}

export type Camera = {
  deviceId: string,
  label: string

}

export type DecodeCode = {
  error: string
}