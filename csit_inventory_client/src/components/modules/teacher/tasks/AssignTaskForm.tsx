"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form";

export default function AssignTaskForm() {
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      requirements: [] as { value: string }[],
    },
  });

  const [requirementInput, setRequirementInput] = useState("");

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const handleAddRequirement = () => {
    if (!requirementInput.trim()) return;

    append({ value: requirementInput.trim() });
    setRequirementInput("");
  };
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Task Title <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task title"
                    value={field.value || ""}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Description <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Textarea
                    rows={6}
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter detailed task description"
                    value={field.value || ""}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Assign to Student */}
            {/* <div className="space-y-2">
              <Label htmlFor="student" className="font-medium">
                Assign to Student <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem
                      key={student.studentId}
                      value={student.studentId}
                    >
                      {student.name} ({student.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Due Date */}
            <Controller
              name="dueDate"
              control={form.control}
              rules={{
                required: "Due Date is required",
                validate: (value) => {
                  if (!value) return "Due Date is required";
                  const selected = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (selected < today) {
                    return "Due date cannot be in the past";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => {
                const minNow = getTodayDateString();
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Due Date <span className="text-red-500">*</span>
                    </FieldLabel>
                    <input
                      type="date"
                      id={field.name}
                      name={field.name}
                      min={minNow.slice(0, 10)}
                      value={field.value ? field.value.slice(0, 10) : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const selected = new Date(val);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (selected < today) return;
                          // Store as full ISO string (end of day)
                          field.onChange(val + "T23:59");
                        } else {
                          field.onChange("");
                        }
                      }}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">
              Requirements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add task requirements one by one
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Enter a requirement"
                autoComplete="off"
              />

              <Button type="button" onClick={handleAddRequirement}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {fields.length > 0 && (
              <ul className="flex items-center gap-2">
                {fields.map((field, index) => (
                  <li
                    key={field.id}
                    className="group flex items-center gap-2 rounded-full border border-gray-200 bg-muted/40 px-3 py-1.5 text-sm text-gray-800 transition hover:bg-muted"
                  >
                    <span className="max-w-55 truncate">
                      {field.value}
                    </span>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-full p-0.5 text-gray-400 transition hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5 " />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Reference Materials - File Uploader */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Reference Materials (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload reference documents and materials to help students complete
              the task.
            </p>

            <FileUploader
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              uploadError={uploadError}
              setUploadError={setUploadError}
            />
          </CardContent>
        </Card> */}
      </div>

      {/* Sidebar - Right Side */}
      <div className="space-y-6">
        {/* Task Summary */}
        <Card className="border-2 border-primary/50 sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Task Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Student
              </p>
              {/* <p className="text-sm font-medium">
                {selectedStudent
                  ? students.find((s) => s.studentId === selectedStudent)
                      ?.name || "Not selected"
                  : "Not selected"}
              </p> */}
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Due Date
              </p>
              {/* <p className="text-sm font-medium">
                {selectedDueDate
                  ? format(new Date(selectedDueDate), "MMM dd, yyyy")
                  : "Not set"}
              </p> */}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                className="w-full"
                size="lg"
              >

                Assign Task
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                Clear Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
