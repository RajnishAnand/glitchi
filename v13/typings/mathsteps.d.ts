declare module 'mathsteps' {
  export function simplifyExpression(equation: string) {
    return Steps;
  }
}

type Steps = Status[];

interface Status {
  changeType: string;
  oldEquation: Equation;
  newEquation: Equation;
  stubsteps: Status[] | [];
}

interface Equation {
  leftNode: Node;
  rightNode: Node;
  comparator: string;
}

interface Node {
  implicit: boolean;
  op: string;
  fn: string;
  args: []; // CHECK:

  //TODO: differenciate left right nodes
  value: string;
  valueType: string;

  changeGroup: number | undefined;
}
