class Hotel:
    def __init__(self, name, rooms):
        self.name = name
        self.rooms = rooms  # List of available room numbers.
        self.reservations = []  # List of current reservations as (customer_name, room_number).

    def make_reservation(self, customer_name, room_number):
        if room_number not in self.rooms:
            print(f"Room {room_number} isn't available.")
        elif any(res[1] == room_number for res in self.reservations):
            print(f"Room {room_number} is already reserved.")
        else:
            self.reservations.append((customer_name, room_number))
            print(f"Reservation confirmed for {customer_name} in room {room_number}.")

    def cancel_reservation(self, customer_name, room_number):
        """
        Cancel a reservation for a given customer and room number.

        """
        for reservation in self.reservations:
            if reservation == (customer_name, room_number):
                self.reservations.remove(reservation)
                print(f"Reservation for {customer_name} in room {room_number} has been canceled.")
                return
        print(f"No reservation found for {customer_name} in room {room_number}.")

    def view_reservations(self):
        """
        Display all current reservations.
        """
        if not self.reservations:
            print("No reservations have been made yet.")
        else:
            print("Current Reservations:")
            for reservation in self.reservations:
                print(f"Customer: {reservation[0]}, Room: {reservation[1]}")

# Example usage
my_hotel = Hotel("Ocean View", [101, 102, 103])

# Making reservations
my_hotel.make_reservation("John Doe", 101)  # Successful
my_hotel.make_reservation("John Doe2", 101)  # Room already reserved
my_hotel.make_reservation("John Doe3", 104)  # Room not available

# Viewing reservations
my_hotel.view_reservations()

# Canceling reservations
my_hotel.cancel_reservation("John Doe", 101)  # Successful cancellation

# Viewing reservations after cancellation
my_hotel.view_reservations()
