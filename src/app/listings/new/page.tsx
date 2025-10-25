'use client';

import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewListingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create a New Listing</CardTitle>
                <CardDescription>Fill out the details below to post your item on the marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Listing Title</Label>
                    <Input id="title" placeholder="e.g. Vintage Leather Jacket" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your item in detail..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" placeholder="e.g. 150.00" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" type="file" />
                </div>
                <Button type="submit" size="lg" className="w-full">Create Listing</Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
