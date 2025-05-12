export interface VerifyEmail {
    email: string
    autocorrect: string
    deliverability: string
    quality_score: string
    is_valid_format: IsValidFormat
    is_free_email: IsFreeEmail
    is_disposable_email: IsDisposableEmail
    is_role_email: IsRoleEmail
    is_catchall_email: IsCatchallEmail
    is_mx_found: IsMxFound
    is_smtp_valid: IsSmtpValid
  }
  
  export interface IsValidFormat {
    value: boolean
    text: string
  }
  
  export interface IsFreeEmail {
    value: boolean
    text: string
  }
  
  export interface IsDisposableEmail {
    value: boolean
    text: string
  }
  
  export interface IsRoleEmail {
    value: boolean
    text: string
  }
  
  export interface IsCatchallEmail {
    value: boolean
    text: string
  }
  
  export interface IsMxFound {
    value: boolean
    text: string
  }
  
  export interface IsSmtpValid {
    value: boolean
    text: string
  }
  