import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information. This information will be displayed
            on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="Arbitrator" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="arbitrator@example.com" />
          </div>
        </CardContent>
        <CardContent>
             <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline" disabled>
              Enable
            </Button>
          </div>
        </CardContent>
        <CardContent>
            <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified about platform activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails for important events.
            </p>
          </div>
          <div className="space-y-2 pl-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="notify-new-dispute" defaultChecked />
              <Label htmlFor="notify-new-dispute" className="font-normal">
                New dispute assigned to me
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notify-dispute-resolved" />
              <Label htmlFor="notify-dispute-resolved" className="font-normal">
                A dispute I resolved is appealed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notify-platform-updates" defaultChecked />
              <Label htmlFor="notify-platform-updates" className="font-normal">
                Platform news and updates
              </Label>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts on your devices.
              </p>
            </div>
            <Switch id="push-notifications" />
          </div>
        </CardContent>
        <CardContent>
            <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
