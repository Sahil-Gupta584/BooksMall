// This is the old package name (NextUI) - Kody should catch this 
// by checking the HeroUI docs you provided in the rule.
import { Button } from "@nextui-org/react";

export const HeroDemo = () => {
  return (
    <div>
      {/* Kody needs to check if 'color' and 'variant' match HeroUI specs */}
      <Button color="primary" variant="abc">
        Hero Action
      </Button>
    </div>
  );
};
