import FormItemField from "@/components/Form/ItemField";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAddTestFormContext from "@/lib/hooks/addTestForm/context";
import { AddTestFormSchemaType } from "@/lib/zod/schemas/addTestForm/Index";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function AddTestFormCategory() {
  const { categories } = useAddTestFormContext();
  const { control } = useFormContext<AddTestFormSchemaType>();

  return (
    <FormItemField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <>
          <FormLabel>Категория</FormLabel>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <FormControl>
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <span className="truncate">
                    {categories.find(({ value }) => value === field.value)
                      ?.label ?? (
                      <span className="text-muted-foreground">
                        Выберите категорию
                      </span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </FormControl>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
              <DropdownMenuRadioGroup
                value={field.value}
                onValueChange={field.onChange}
              >
                {categories.map(({ label, value }) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </>
      )}
    />
  );
}
