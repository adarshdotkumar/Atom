import type { ComponentType } from "react";
import type { DemoKey } from "@/content/case-studies";
import { PulseDot } from "./pulse-dot";

export const demoRegistry: Record<DemoKey, ComponentType> = {
  "pulse-dot": PulseDot,
};
