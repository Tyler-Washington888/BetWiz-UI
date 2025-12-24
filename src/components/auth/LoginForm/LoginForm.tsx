import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Logo from "../../common/Logo/Logo";
import { subscribeToBet360, getBet360ConnectUrl, getBet360SubscribeEmail, clearBet360Data } from "../../../services/bet360Subscription";
import "./LoginForm.css";

const BETWIZ_API_URL = import.meta.env.VITE_BETWIZ_API_URL || "http:

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoApproving, setAutoApproving] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoApproved = useRef(false);
  
  
  const isBet360Flow = location.pathname.includes("/bet360");
  const bet360Email = getBet360SubscribeEmail();
  
  
  const urlParams = new URLSearchParams(location.search);
  const isOAuthRedirect = urlParams.get("oauth_redirect") === "true";

  
  useEffect(() => {
    if (isOAuthRedirect && !hasAutoApproved.current) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        
        return;
      }

      
      
      const verifyAndApprove = async () => {
        try {
          
          const verifyResponse = await fetch(`${BETWIZ_API_URL}/api/users/profile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!verifyResponse.ok) {
            
            return;
          }

          
          hasAutoApproved.current = true;
          setAutoApproving(true);

          
          const clientId = urlParams.get("client_id");
          const redirectUri = urlParams.get("redirect_uri");
          const responseType = urlParams.get("response_type");
          const scope = urlParams.get("scope");
          const state = urlParams.get("state");
          const codeChallenge = urlParams.get("code_challenge");
          const codeChallengeMethod = urlParams.get("code_challenge_method");

          if (clientId && redirectUri && codeChallenge) {
            const params: Record<string, string> = {
              client_id: clientId,
              redirect_uri: redirectUri,
              response_type: responseType || "code",
              code_challenge: codeChallenge,
            };
            if (scope) params.scope = scope;
            if (state) params.state = state;
            if (codeChallengeMethod) params.code_challenge_method = codeChallengeMethod;

            
            const approveResponse = await fetch(`${BETWIZ_API_URL}/oauth/authorize`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(params),
              redirect: "manual",
            });

            if (approveResponse.ok) {
              const data = await approveResponse.json();
              if (data.redirect_uri) {
                window.location.href = data.redirect_uri;
              } else {
                throw new Error("No redirect URI in response");
              }
            } else {
              const errorData = await approveResponse.json().catch(() => ({ error: "Authorization failed" }));
              throw new Error(errorData.error || "Authorization failed");
            }
          } else {
            setAutoApproving(false);
          }
        } catch (fetchError) {
          setAutoApproving(false);
          
        }
      };

      verifyAndApprove();
    }
  }, [isOAuthRedirect, location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubscriptionError("");
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);

      
      
      if (isOAuthRedirect) {
        
        const clientId = urlParams.get("client_id");
        const redirectUri = urlParams.get("redirect_uri");
        const responseType = urlParams.get("response_type");
        const scope = urlParams.get("scope");
        const state = urlParams.get("state");
        const codeChallenge = urlParams.get("code_challenge");
        const codeChallengeMethod = urlParams.get("code_challenge_method");
        
        if (clientId && redirectUri && codeChallenge) {
          
          const token = localStorage.getItem("authToken");
          if (token) {
            
            const BETWIZ_API_URL = import.meta.env.VITE_BETWIZ_API_URL || "http:
            
            
            const form = document.createElement("form");
            form.method = "POST";
            form.action = `${BETWIZ_API_URL}/oauth/authorize`;
            
            
            const params: Record<string, string> = {
              client_id: clientId,
              redirect_uri: redirectUri,
              response_type: responseType || "code",
              code_challenge: codeChallenge,
            };
            if (scope) params.scope = scope;
            if (state) params.state = state;
            if (codeChallengeMethod) params.code_challenge_method = codeChallengeMethod;
            
            Object.entries(params).forEach(([key, value]) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });
            
            
            
            
            fetch(`${BETWIZ_API_URL}/oauth/authorize`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
              },
              body: JSON.stringify(params),
            })
              .then(async (response) => {
                if (response.ok) {
                  
                  const data = await response.json();
                  if (data.redirect_uri) {
                    window.location.href = data.redirect_uri;
                  } else {
                    throw new Error("No redirect URI received");
                  }
                } else {
                  const errorData = await response.json().catch(() => ({ error: "Authorization failed" }));
                  throw new Error(errorData.error || errorData.message || "Authorization failed");
                }
              })
              .catch((error) => {
                setError(error.message || "Failed to complete authorization. Please try again.");
              });
            return;
          }
        }
      }

      
      if (isBet360Flow && userData && bet360Email) {
        setSubscribing(true);
        try {
          await subscribeToBet360(userData._id, bet360Email);
          
          setSubscriptionSuccess(true);
          setSubscribing(false);
          
          
          clearBet360Data();
          setTimeout(() => {
            window.location.href = getBet360ConnectUrl();
          }, 3000);
          return;
        } catch (subErr: any) {
          
          setSubscribing(false);
          const subErrorMsg =
            subErr?.response?.data?.message ||
            subErr?.response?.data?.error ||
            subErr?.message ||
            "Failed to connect to Bet360";
          setSubscriptionError(subErrorMsg);
          
          
          clearBet360Data();
          
          setTimeout(() => {
            window.location.href = getBet360ConnectUrl();
          }, 3000);
          return;
        }
      } else if (isBet360Flow && !bet360Email) {
        
        clearBet360Data();
        setSubscriptionError("Bet360 connection data not found. Redirecting...");
        setTimeout(() => {
          window.location.href = getBet360ConnectUrl();
        }, 2000);
        return;
      }

      
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="betwiz-logo">
        <Logo size="large" />
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="tyler.washington@gmail.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input password-input"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPassword(!showPassword);
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {(subscribing || autoApproving || loading) && (
          <div className="subscription-loading-message">
            <div className="loading-spinner-small"></div>
            <span>
              {autoApproving 
                ? "Approving subscription to BetWiz..." 
                : subscribing
                ? "Subscribing to BetWiz..."
                : loading && isOAuthRedirect
                ? "Logging in and subscribing to BetWiz..."
                : loading
                ? "Logging in..."
                : "Processing..."}
            </span>
          </div>
        )}
        {subscriptionSuccess && (
          <div className="subscription-success-message">
            <span className="success-icon">✓</span>
            <span>Successfully subscribed to Bet360!</span>
            <br />
            <small>Redirecting back to Bet360...</small>
          </div>
        )}
        {subscriptionError && (
          <div className="subscription-error-message">
            {subscriptionError}
            <br />
            <small>Redirecting to Bet360...</small>
          </div>
        )}

        <button type="submit" className="login-button" disabled={loading || subscribing || autoApproving}>
          {loading || subscribing || autoApproving ? "Processing..." : "Login"}
        </button>
        {isOAuthRedirect && (
          <p className="login-subtitle">and subscribe Bet360 to betting activity</p>
        )}
      </form>

      <div className="signup-section">
        <p className="signup-text">New to BetWiz?</p>
        <Link to="/signup" className="signup-button">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
