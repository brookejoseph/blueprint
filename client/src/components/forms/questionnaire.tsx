import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { IMPROVEMENT_AREAS, BUDGET_RANGES, AVAILABLE_EQUIPMENT, CURRENT_HEALTH } from "@/lib/types";
import type { UserFormData } from "@/lib/types";
import { Brain, Moon, Activity, Dumbbell, Infinity, Hourglass } from "lucide-react";

const ICONS = {
  brain: Brain,
  moon: Moon,
  activity: Activity,
  dumbbell: Dumbbell,
  infinity: Infinity,
  hourglass: Hourglass,
};

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const form = useForm<UserFormData>({
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      improvementAreas: [],
      budget: "",
      equipment: [],
      currentHealth: [],
    },
  });

  const createRoutine = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/routine/${data.id}`);
    },
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = (data: UserFormData) => {
    createRoutine.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How old are you?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your gender?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentHealth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you currently doing for your health?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {CURRENT_HEALTH.map((item) => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer transition-all ${
                            field.value.includes(item.id)
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          }`}
                          onClick={() => {
                            const newValue = field.value.includes(item.id)
                              ? field.value.filter((v) => v !== item.id)
                              : [...field.value, item.id];
                            field.onChange(newValue);
                          }}
                        >
                          <CardContent className="flex items-center gap-3 p-4">
                            <span>{item.label}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="improvementAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which areas would you like to optimize?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {IMPROVEMENT_AREAS.map((area) => {
                        const Icon = ICONS[area.icon as keyof typeof ICONS];
                        return (
                          <Card
                            key={area.id}
                            className={`cursor-pointer transition-all ${
                              field.value.includes(area.id)
                                ? "border-blue-500 bg-blue-50"
                                : ""
                            }`}
                            onClick={() => {
                              const newValue = field.value.includes(area.id)
                                ? field.value.filter((v) => v !== area.id)
                                : [...field.value, area.id];
                              field.onChange(newValue);
                            }}
                          >
                            <CardContent className="flex items-center gap-3 p-4">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <span>{area.label}</span>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which health optimization tools do you have access to?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {AVAILABLE_EQUIPMENT.map((item) => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer transition-all ${
                            field.value.includes(item.id)
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          }`}
                          onClick={() => {
                            const newValue = field.value.includes(item.id)
                              ? field.value.filter((v) => v !== item.id)
                              : [...field.value, item.id];
                            field.onChange(newValue);
                          }}
                        >
                          <CardContent className="flex items-center gap-3 p-4">
                            <span>{item.label}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your monthly budget for health optimization?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUDGET_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Create My Protocol
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}