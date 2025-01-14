from collections import defaultdict
from datetime import datetime, timedelta

# Configurable thresholds
MAX_FAILED_ATTEMPTS = 5
TIME_WINDOW = timedelta(minutes=10)

# Data structure to track failed attempts
failed_attempts = defaultdict(list)

def parse_log_entry(log_entry):
    # Splitting the log entry into its components
    timestamp_str, username, ip_address, access_result = log_entry.split()
    timestamp = datetime.fromisoformat(timestamp_str[:-1])  # Remove the 'Z' and convert to datetime
    return timestamp, username, ip_address, access_result

def detect_security_violations(log_entries):
    violations = []
    
    for log_entry in log_entries:
        timestamp, username, ip_address, access_result = parse_log_entry(log_entry)
        
        if access_result == "FAILURE":
            # Track failed login attempts for both username and IP address
            failed_attempts[username].append((timestamp, ip_address))
            failed_attempts[ip_address].append((timestamp, username))

        # Check for violations based on the failed attempts within the time window
        for user_or_ip, attempts in list(failed_attempts.items()):
            # Clean up any failed attempts outside of the time window
            attempts = [entry for entry in attempts if entry[0] > timestamp - TIME_WINDOW]
            failed_attempts[user_or_ip] = attempts

            # Check if the number of failed attempts exceeds the threshold
            if len(attempts) >= MAX_FAILED_ATTEMPTS:
                violations.append({
                    'user_or_ip': user_or_ip,
                    'failed_attempts': len(attempts),
                    'last_failed_at': attempts[-1][0],
                })
                
    return violations

# Sample log entries (timestamp, username, ip_address, access_result)
log_entries = [
    "2025-01-11T08:00:00Z user1 192.168.1.1 FAILURE",
    "2025-01-11T08:01:00Z user1 192.168.1.1 FAILURE",
    "2025-01-11T08:02:00Z user1 192.168.1.1 FAILURE",
    "2025-01-11T08:03:00Z user1 192.168.1.1 FAILURE",
    "2025-01-11T08:04:00Z user1 192.168.1.1 FAILURE",
    "2025-01-11T08:05:00Z user2 192.168.1.2 FAILURE",
    "2025-01-11T08:06:00Z user2 192.168.1.2 FAILURE",
    "2025-01-11T08:07:00Z user2 192.168.1.2 FAILURE",
    "2025-01-11T08:08:00Z user2 192.168.1.2 FAILURE",
    "2025-01-11T08:09:00Z user2 192.168.1.2 FAILURE",
]

violations = detect_security_violations(log_entries)

for violation in violations:
    print(f"Violation detected: {violation['user_or_ip']} has {violation['failed_attempts']} failed attempts.")