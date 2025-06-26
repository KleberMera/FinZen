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
    if (!password) {
      return {
        score: 0,
        feedback: this.getFeedback(0),
        color: this.getColor(0)
      };
    }

    let score = 0;
    const hasMinLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Length check
    if (hasMinLength) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (hasNumber) score++;
    if (hasLower && hasUpper) score++;
    if (hasSpecial) score++;
    
    // Requisitos mínimos: longitud, mayúscula, minúscula y carácter especial
    const meetsMinimumRequirements = hasMinLength && hasLower && hasUpper && hasSpecial;
    
    // Normalizar puntuación a rango 0-4
    score = Math.min(4, score);
    
    // Si no cumple con los requisitos mínimos, forzar puntuación máxima de 1
    if (!meetsMinimumRequirements && score > 1) {
      score = 1;
    }
    
    return {
      score,
      feedback: this.getFeedback(score, { hasLower, hasUpper, hasSpecial, hasMinLength }),
      color: this.getColor(score)
    };
  }

  private getFeedback(score: number, checks?: { hasLower: boolean; hasUpper: boolean; hasSpecial: boolean; hasMinLength: boolean }): string {
    if (score <= 1) {
      if (!checks) return 'Muy débil';
      
      const missingRequirements = [];
      if (!checks.hasMinLength) missingRequirements.push('al menos 8 caracteres');
      if (!checks.hasLower) missingRequirements.push('una minúscula');
      if (!checks.hasUpper) missingRequirements.push('una mayúscula');
      if (!checks.hasSpecial) missingRequirements.push('un carácter especial');
      
      return `Débil - Requiere ${missingRequirements.join(', ')}`;
    }
    
    switch (score) {
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
