"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon" variant="outline" className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
