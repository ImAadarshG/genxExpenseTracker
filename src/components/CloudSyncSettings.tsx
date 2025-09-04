"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cloudSync } from "@/lib/cloudSync";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { Cloud, CloudOff, Download, Upload, RefreshCw, AlertCircle } from "lucide-react";

export function CloudSyncSettings() {
  const { user } = useStore();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const isCloudSyncEnabled = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === 'true';

  useEffect(() => {
    if (user?.email && isCloudSyncEnabled) {
      checkSyncStatus();
    }
  }, [user]);

  const checkSyncStatus = async () => {
    if (!user?.email) return;
    
    try {
      const status = await cloudSync.getSyncStatus(user.email);
      setSyncStatus(status);
      setSyncEnabled(status.enabled);
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const handleSyncToCloud = async () => {
    if (!user?.email) {
      toast.error("Please login to sync your data");
      return;
    }

    setSyncing(true);
    try {
      const result = await cloudSync.syncToCloud(user.email);
      if (result?.success) {
        toast.success("Data synced to cloud successfully!");
        await checkSyncStatus();
      } else {
        toast.error("Failed to sync data to cloud");
      }
    } catch (error) {
      toast.error("Error syncing data");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncFromCloud = async () => {
    if (!user?.email) {
      toast.error("Please login to sync your data");
      return;
    }

    if (!confirm("This will replace all your local data with cloud data. Continue?")) {
      return;
    }

    setSyncing(true);
    try {
      const result = await cloudSync.syncFromCloud(user.email);
      if (result?.success) {
        toast.success("Data synced from cloud successfully!");
        window.location.reload(); // Reload to show updated data
      } else {
        toast.error("Failed to sync data from cloud");
      }
    } catch (error) {
      toast.error("Error syncing data");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  if (!isCloudSyncEnabled) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Cloud Sync Not Configured
          </CardTitle>
          <CardDescription>
            Cloud sync requires a Vercel Postgres database. Set up your database and add the connection string to enable syncing across devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-white dark:bg-gray-900 p-4 border">
              <h4 className="font-medium mb-2">To enable cloud sync:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create a Vercel Postgres database in your Vercel dashboard</li>
                <li>Copy the environment variables to your .env.local file</li>
                <li>Set NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true</li>
                <li>Restart your development server</li>
              </ol>
            </div>
            <Button variant="outline" asChild>
              <a
                href="https://vercel.com/dashboard/stores"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Vercel Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Sync</CardTitle>
        <CardDescription>
          Sync your expense data across all your devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!user ? (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please login to enable cloud sync
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cloud-sync">Enable Cloud Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync your data to the cloud
                </p>
              </div>
              <Switch
                id="cloud-sync"
                checked={syncEnabled}
                onCheckedChange={setSyncEnabled}
              />
            </div>

            {syncStatus && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  {syncStatus.enabled ? (
                    <Cloud className="h-4 w-4 text-green-600" />
                  ) : (
                    <CloudOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {syncStatus.enabled ? "Connected" : "Disconnected"}
                  </span>
                </div>
                {syncStatus.cloudRecords !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Cloud records: {syncStatus.cloudRecords}
                  </p>
                )}
                {syncStatus.lastSync && (
                  <p className="text-xs text-muted-foreground">
                    Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
                  </p>
                )}
                {syncStatus.error && (
                  <p className="text-xs text-destructive">{syncStatus.error}</p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleSyncToCloud}
                  disabled={syncing || !syncEnabled}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {syncing ? "Syncing..." : "Upload to Cloud"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSyncFromCloud}
                  disabled={syncing || !syncEnabled}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {syncing ? "Syncing..." : "Download from Cloud"}
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={checkSyncStatus}
                disabled={syncing}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                How it works
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Upload: Saves your local data to the cloud</li>
                <li>• Download: Replaces local data with cloud data</li>
                <li>• Login on any device to access your data</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
