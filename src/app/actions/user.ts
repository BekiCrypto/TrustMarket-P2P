
'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase'; // Using admin-initialized version on server
import { revalidatePath } from 'next/cache';
import { UserKycStatus } from '@/types';

interface UpdateKycStatusInput {
    userId: string;
    status: UserKycStatus;
}
  
export async function updateUserKycStatus(input: UpdateKycStatusInput) {
    const { firestore } = getSdks();
    
    if (!input.userId) {
        return { success: false, error: 'User ID is required.' };
    }

    const userRef = doc(firestore, 'users', input.userId);

    try {
        await updateDoc(userRef, {
            kycStatus: input.status,
        });

        // Revalidate the users page to show the new status
        revalidatePath('/users');

        return { success: true, message: `User ${input.userId} KYC status updated to ${input.status}.` };

    } catch (error) {
        console.error('Error updating KYC status:', error);
        return { success: false, error: 'Failed to update user in Firestore.' };
    }
}
