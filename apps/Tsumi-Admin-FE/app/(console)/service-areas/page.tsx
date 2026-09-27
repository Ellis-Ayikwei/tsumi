"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { LatLng } from "@tsumi/ui/lib/maps";

import { AreasMap, STATUS_COLOR } from "@/components/areas-map";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError, qs } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { ServiceArea, ServiceAreaKind, ServiceAreaStatus } from "@/lib/types";

const KINDS: { value: ServiceAreaKind; label: string }[] = [
  { value: "region", label: "Region" },
  { value: "city", label: "City or town" },
  { value: "zone", label: "Zone" },
];
const STATUSES: { value: ServiceAreaStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "no_service", label: "No service" },
  { value: "inactive", label: "Inactive" },
];
const PLURAL: Record<ServiceAreaKind, string> = { region: "Regions", city: "Cities or towns", zone: "Zones" };
const kindLabel = (k: ServiceAreaKind) => KINDS.find((x) => x.value === k)?.label ?? k;

/** A GeoJSON geometry from a pasted or uploaded file: accepts a geometry, a Feature, or a one-feature collection. */
function geometryFrom(text: string): object {
  const parsed = JSON.parse(text);
  if (parsed?.type === "Feature") return parsed.geometry;
  if (parsed?.type === "FeatureCollection" && parsed.features?.length === 1) return parsed.features[0].geometry;
  return parsed;
}

export default function ServiceAreasPage() {
  const client = useQueryClient();
  const [picked, setPicked] = useState<LatLng | null>(null);
  const [editing, setEditing] = useState<ServiceArea | "new" | null>(null);
  const [importing, setImporting] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["service-areas"],
    queryFn: () => api<ServiceArea[]>("/admin/service-areas/"),
  });
  const check = useQuery({
    queryKey: ["service-area-check", picked?.lat, picked?.lng],
    queryFn: () => api<{ served: boolean; message: string | null }>(`/admin/service-areas/check/${qs({ lat: picked?.lat, lng: picked?.lng })}`),
    enabled: picked !== null,
  });

  const refresh = () => {
    client.invalidateQueries({ queryKey: ["service-areas"] });
    client.invalidateQueries({ queryKey: ["service-area-check"] });
  };

  const setStatus = async (area: ServiceArea, status: ServiceAreaStatus) => {
    try {
      await api(`/admin/service-areas/${area.id}/`, { method: "PATCH", body: { status } });
      refresh();
      toast.success(`${area.name} is now ${STATUSES.find((s) => s.value === status)?.label.toLowerCase()}.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not change the status. Try again.");
    }
  };

  const anyActive = data?.some((a) => a.status === "active") ?? false;

  return (
    <>
      <PageHeader
        title="Service areas"
        description="Where runners take errands. Click the map to test a spot or to start a new area there."
        actions={
          <>
            <Button variant="outline" onClick={() => setImporting(true)}>
              <Upload /> Import GeoJSON
            </Button>
            <Button onClick={() => setEditing("new")}>
              <Plus /> Add area
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <AreasMap areas={data ?? []} onPick={setPicked} />

        {picked && (
          <div className="flex flex-wrap items-center gap-3 rounded-md border p-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="font-mono text-xs text-muted-foreground">
              {picked.lat.toFixed(5)}, {picked.lng.toFixed(5)}
            </span>
            <span className="flex-1" aria-live="polite">
              {check.isLoading ? "Checking..." : check.data?.served ? "Errands pinned here are accepted." : check.data?.message}
            </span>
            <Button size="sm" variant="outline" onClick={() => setEditing("new")}>
              Add an area here
            </Button>
          </div>
        )}

        {data && data.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {anyActive
              ? "Errands must be pinned inside an Active area, and never inside a No service area."
              : "No area is Active yet, so errands are accepted everywhere except No service areas."}
          </p>
        )}

        {isLoading && <LoadingRows />}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}
        {data && data.length === 0 && (
          <EmptyState
            title="No service areas yet"
            hint="Errands are accepted everywhere until you add one. Import Ghana's regions or add a zone."
          />
        )}
        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note for customers</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((area) => (
                <TableRow key={area.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[area.status] }} />
                      {area.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{kindLabel(area.kind)}</div>
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      aria-label={`Status of ${area.name}`}
                      value={area.status}
                      onChange={(e) => setStatus(area, e.target.value as ServiceAreaStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{area.note || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{formatDateTime(area.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(area)}>
                        Edit
                      </Button>
                      <ConfirmDialog
                        trigger={<Button size="sm" variant="ghost">Delete</Button>}
                        title={`Delete ${area.name}?`}
                        description="The shape is removed for good. To stop errands here but keep the shape, set it to No service instead."
                        confirmLabel="Delete area"
                        confirmVariant="destructive"
                        onConfirm={async () => {
                          await api(`/admin/service-areas/${area.id}/`, { method: "DELETE" });
                          refresh();
                          toast.success(`${area.name} deleted.`);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <AreaDialog
          area={editing === "new" ? null : editing}
          center={picked}
          onClose={() => setEditing(null)}
          onSaved={(area, created) => {
            setEditing(null);
            refresh();
            toast.success(created ? `${area.name} added.` : `${area.name} saved.`);
          }}
        />
      )}
      {importing && (
        <ImportDialog
          onClose={() => setImporting(false)}
          onDone={(created, updated) => {
            setImporting(false);
            refresh();
            toast.success(`Imported: ${created} new, ${updated} updated. New areas start Inactive.`);
          }}
        />
      )}
    </>
  );
}

/** Add or edit one area. A new area needs a shape; an edit keeps its shape unless one is given. */
function AreaDialog({
  area,
  center,
  onClose,
  onSaved,
}: {
  area: ServiceArea | null;
  center: LatLng | null;
  onClose: () => void;
  onSaved: (area: ServiceArea, created: boolean) => void;
}) {
  const [form, setForm] = useState({
    name: area?.name ?? "",
    kind: area?.kind ?? ("zone" as ServiceAreaKind),
    status: area?.status ?? ("active" as ServiceAreaStatus),
    note: area?.note ?? "",
  });
  const [shape, setShape] = useState<"keep" | "circle" | "geojson">(area ? "keep" : "circle");
  const [circle, setCircle] = useState({
    lat: center ? center.lat.toFixed(6) : "",
    lng: center ? center.lng.toFixed(6) : "",
    radius_km: "3",
  });
  const [geojson, setGeojson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const body: Record<string, unknown> = { ...form };
    if (shape === "circle") body.circle = { lat: Number(circle.lat), lng: Number(circle.lng), radius_km: Number(circle.radius_km) };
    if (shape === "geojson") {
      try {
        body.boundary = geometryFrom(geojson);
      } catch {
        setError("That isn't valid JSON. Paste a GeoJSON Polygon or MultiPolygon.");
        return;
      }
    }
    setBusy(true);
    try {
      const saved = area
        ? await api<ServiceArea>(`/admin/service-areas/${area.id}/`, { method: "PATCH", body })
        : await api<ServiceArea>("/admin/service-areas/", { method: "POST", body });
      onSaved(saved, !area);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the area. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{area ? `Edit ${area.name}` : "Add a service area"}</DialogTitle>
            <DialogDescription>
              A circle is quickest for a neighbourhood. For exact boundaries, paste or upload GeoJSON.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 grid gap-1.5">
              <Label htmlFor="area-name">Name</Label>
              <Input id="area-name" required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="East Legon" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="area-kind">Type</Label>
              <NativeSelect id="area-kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ServiceAreaKind })}>
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="area-status">Status</Label>
              <NativeSelect id="area-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ServiceAreaStatus })}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="col-span-2 grid gap-1.5">
              <Label htmlFor="area-note">Note for customers (optional)</Label>
              <Input
                id="area-note"
                maxLength={255}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Shown when an errand is refused here, e.g. Back on Monday."
              />
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-1.5 text-sm font-medium">Shape</legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Shape">
              {(area ? (["keep", "circle", "geojson"] as const) : (["circle", "geojson"] as const)).map((s) => (
                <Button key={s} type="button" size="sm" variant={shape === s ? "default" : "outline"} role="radio" aria-checked={shape === s} onClick={() => setShape(s)}>
                  {s === "keep" ? "Keep current" : s === "circle" ? "Circle" : "GeoJSON"}
                </Button>
              ))}
            </div>
            {shape === "circle" && (
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="circle-lat">Centre latitude</Label>
                  <Input id="circle-lat" required inputMode="decimal" value={circle.lat} onChange={(e) => setCircle({ ...circle, lat: e.target.value })} placeholder="5.6037" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="circle-lng">Centre longitude</Label>
                  <Input id="circle-lng" required inputMode="decimal" value={circle.lng} onChange={(e) => setCircle({ ...circle, lng: e.target.value })} placeholder="-0.1870" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="circle-radius">Radius (km)</Label>
                  <Input id="circle-radius" required inputMode="decimal" value={circle.radius_km} onChange={(e) => setCircle({ ...circle, radius_km: e.target.value })} />
                </div>
                {!center && <p className="col-span-3 text-xs text-muted-foreground">Tip: click the map first and the centre fills in.</p>}
              </div>
            )}
            {shape === "geojson" && (
              <div className="grid gap-1.5">
                <Label htmlFor="area-geojson">GeoJSON Polygon or MultiPolygon</Label>
                <Input
                  type="file"
                  accept=".geojson,.json,application/geo+json,application/json"
                  aria-label="Upload a GeoJSON file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) setGeojson(await file.text());
                  }}
                />
                <Textarea id="area-geojson" rows={5} value={geojson} onChange={(e) => setGeojson(e.target.value)} placeholder='{"type": "Polygon", "coordinates": [[[lng, lat], ...]]}' className="font-mono text-xs" />
              </div>
            )}
          </fieldset>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving..." : area ? "Save area" : "Add area"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Bulk import from a boundary file, e.g. Ghana's 16 regions from geoBoundaries (use the simplified file). */
function ImportDialog({ onClose, onDone }: { onClose: () => void; onDone: (created: number, updated: number) => void }) {
  const [kind, setKind] = useState<ServiceAreaKind>("region");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError(null);
    let features: unknown;
    try {
      features = JSON.parse(await file.text());
    } catch {
      setError("That file isn't valid JSON. Upload a GeoJSON FeatureCollection.");
      return;
    }
    setBusy(true);
    try {
      const result = await api<{ created: number; updated: number }>("/admin/service-areas/import/", { method: "POST", body: { kind, features } });
      onDone(result.created, result.updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Import failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Import areas from GeoJSON</DialogTitle>
            <DialogDescription>
              One area per feature, named from its properties (name, shapeName, ADM1_EN and similar). New areas start
              Inactive; re-importing the same file only updates shapes and keeps the statuses you set.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="import-kind">These are</Label>
            <NativeSelect id="import-kind" value={kind} onChange={(e) => setKind(e.target.value as ServiceAreaKind)}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>{PLURAL[k.value]}</option>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="import-file">FeatureCollection file</Label>
            <Input id="import-file" type="file" required accept=".geojson,.json,application/geo+json,application/json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="text-xs text-muted-foreground">Up to 500 features. Use a simplified boundary file to keep it small.</p>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!file || busy}>{busy ? "Importing..." : "Import"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
