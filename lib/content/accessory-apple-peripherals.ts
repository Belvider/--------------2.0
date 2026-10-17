import type { ModuleContentBlock } from "../module-content";
import applePeripheralsContent from "./apple-peripherals";

export const accessoryApplePeripheralsBlocks: ModuleContentBlock[] = [
  ...applePeripheralsContent.applePeripheralsFoundationBlocks,
  ...applePeripheralsContent.applePeripheralsCatalogBlocks
];

const accessoryApplePeripheralsContent = {
  accessoryApplePeripheralsBlocks
};

export default accessoryApplePeripheralsContent;
