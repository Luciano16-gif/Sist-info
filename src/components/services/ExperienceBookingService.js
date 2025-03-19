import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Service for handling experience booking operations
 */
class ExperienceBookingService {
  /**
   * Update available slots after a successful booking
   * 
   * @param {string} experienceId - The ID of the experience
   * @param {number} peopleCount - Number of people in the booking
   * @returns {Promise<boolean>} - Success status
   */
  async updateAvailableSlots(experienceId, peopleCount) {
    try {
      if (!experienceId) {
        console.error("Experience ID is required to update available slots");
        return false;
      }

      // Convert peopleCount to a number if it's a string
      const numPeople = typeof peopleCount === 'string' ? parseInt(peopleCount, 10) : peopleCount;
      
      if (isNaN(numPeople) || numPeople <= 0) {
        console.error("Invalid people count:", peopleCount);
        return false;
      }

      // Get the experience document
      const experienceRef = doc(db, "Experiencias", experienceId);
      const experienceDoc = await getDoc(experienceRef);

      if (!experienceDoc.exists()) {
        console.error(`Experience with ID ${experienceId} not found`);
        return false;
      }

      const experienceData = experienceDoc.data();
      
      // Calculate new values
      const currentAvailableSlots = experienceData.cuposDisponibles || 0;
      const currentRegisteredUsers = experienceData.usuariosInscritos || 0;
      
      // Check if there are enough available slots
      if (currentAvailableSlots < numPeople) {
        console.error(`Not enough available slots. Available: ${currentAvailableSlots}, Requested: ${numPeople}`);
        return false;
      }

      // Update the experience document
      await updateDoc(experienceRef, {
        // Use increment to safely update counters in Firestore
        cuposDisponibles: increment(-numPeople),
        usuariosInscritos: increment(numPeople)
      });

      console.log(`Successfully updated experience ${experienceId}. Booked ${numPeople} slots.`);
      return true;
    } catch (error) {
      console.error("Error updating available slots:", error);
      return false;
    }
  }

  /**
   * Process a complete booking - update slots and any other required operations
   * 
   * @param {Object} bookingData - The booking data
   * @returns {Promise<boolean>} - Success status
   */
  async processBookingCompletion(bookingData) {
    try {
      if (!bookingData || !bookingData.experienceId || !bookingData.selectedPeople) {
        console.error("Invalid booking data", bookingData);
        return false;
      }

      // Update available slots
      const slotsUpdated = await this.updateAvailableSlots(
        bookingData.experienceId, 
        bookingData.selectedPeople
      );

      if (!slotsUpdated) {
        console.error("Failed to update available slots");
        return false;
      }

      // Any additional booking completion logic can go here
      
      return true;
    } catch (error) {
      console.error("Error processing booking completion:", error);
      return false;
    }
  }
}

// Export a singleton instance
export default new ExperienceBookingService();