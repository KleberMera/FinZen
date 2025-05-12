import { Injectable } from '@angular/core';

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {
  checkStrength(password: string): PasswordStrength {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[0-9]/.test(password)) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    // Normalize score to 0-4 range
    score = Math.min(4, score);
    
    return {
      score,
      feedback: this.getFeedback(score),
      color: this.getColor(score)
    };
  }

  private getFeedback(score: number): string {
    switch (score) {
      case 0: return 'Muy débil';
      case 1: return 'Débil';
      case 2: return 'Regular';
      case 3: return 'Fuerte';
      case 4: return 'Muy fuerte';
      default: return '';
    }
  }

  private getColor(score: number): string {
    switch (score) {
      case 0: return '#ff4444';
      case 1: return '#ffbb33';
      case 2: return '#ffbb33';
      case 3: return '#00C851';
      case 4: return '#007E33';
      default: return '#ff4444';
    }
  }
}
