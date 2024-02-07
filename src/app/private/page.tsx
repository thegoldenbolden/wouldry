"use client";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

function Buttons() {
  return (
    <div className="flex grow flex-col items-center justify-center gap-16 px-3 py-6">
      <Card className="light grid max-w-screen-md grid-cols-6 gap-4 p-6">
        <Button size="md" fill="foreground">
          Button
        </Button>
        <Button size="md" fill="primary">
          Button
        </Button>
        <Button size="md" fill="danger">
          Button
        </Button>
        <Button size="md" fill="warning">
          Button
        </Button>
        <Button size="md" fill="success">
          Button
        </Button>
        <Button size="md" fill="border">
          Button
        </Button>

        <Button size="md" ghost="foreground">
          Button
        </Button>
        <Button size="md" ghost="primary">
          Button
        </Button>
        <Button size="md" ghost="danger">
          Button
        </Button>
        <Button size="md" ghost="warning">
          Button
        </Button>
        <Button size="md" ghost="success">
          Button
        </Button>
        <Button size="md" ghost="border">
          Button
        </Button>

        <Button size="md" outline="foreground">
          Button
        </Button>
        <Button size="md" outline="primary">
          Button
        </Button>
        <Button size="md" outline="danger">
          Button
        </Button>
        <Button size="md" outline="warning">
          Button
        </Button>
        <Button size="md" outline="success">
          Button
        </Button>
        <Button size="md" outline="border">
          Button
        </Button>

        <Button size="md" text="foreground">
          Button
        </Button>
        <Button size="md" text="primary">
          Button
        </Button>
        <Button size="md" text="danger">
          Button
        </Button>
        <Button size="md" text="warning">
          Button
        </Button>
        <Button size="md" text="success">
          Button
        </Button>
        <Button size="md" text="border">
          Button
        </Button>
      </Card>
      <Card className="max-w-screen-mg dark grid grid-cols-7 gap-4 p-6">
        <Button size="md" fill="foreground">
          Button
        </Button>
        <Button size="md" fill="primary">
          Button
        </Button>
        <Button size="md" fill="danger">
          Button
        </Button>
        <Button size="md" fill="warning">
          Button
        </Button>
        <Button size="md" fill="success">
          Button
        </Button>
        <Button size="md" fill="border">
          Button
        </Button>

        <Button size="md" ghost="foreground">
          Button
        </Button>
        <Button size="md" ghost="primary">
          Button
        </Button>
        <Button size="md" ghost="danger">
          Button
        </Button>
        <Button size="md" ghost="warning">
          Button
        </Button>
        <Button size="md" ghost="success">
          Button
        </Button>
        <Button size="md" ghost="border">
          Button
        </Button>

        <Button size="md" outline="foreground">
          Button
        </Button>
        <Button size="md" outline="primary">
          Button
        </Button>
        <Button size="md" outline="danger">
          Button
        </Button>
        <Button size="md" outline="warning">
          Button
        </Button>
        <Button size="md" outline="success">
          Button
        </Button>
        <Button size="md" outline="border">
          Button
        </Button>

        <Button size="md" text="foreground">
          Button
        </Button>
        <Button size="md" text="primary">
          Button
        </Button>
        <Button size="md" text="danger">
          Button
        </Button>
        <Button size="md" text="warning">
          Button
        </Button>
        <Button size="md" text="success">
          Button
        </Button>
        <Button size="md" text="border">
          Button
        </Button>
      </Card>
    </div>
  );
}

function Toast() {
  return (
    <Card>
      <Button onClick={() => toast.info("Okat")}>Info</Button>
      <Button onClick={() => toast.warning("Okat")}>Warning</Button>
      <Button onClick={() => toast.success("Okat")}>Error</Button>
      <Button onClick={() => toast.error("Okat")}>Success</Button>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="mx-auto max-w-screen-md">
      <Buttons />
      <Toast />
    </div>
  );
}
