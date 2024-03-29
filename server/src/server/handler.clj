(ns server.handler
  (:require
   [clojure.java.io :as io]
   [clojure.pprint]
   [compojure.core :refer :all]
   [compojure.route :as route]
   [ring.util.response :as response]
   [ring.middleware.cors :refer [wrap-cors]]
   [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
   [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))


(def ips (atom {}))


(defroutes app-routes

  (GET "/" []
       (response/redirect "index.html"))

  (GET "/items/*" {params :route-params :as request}
       (let [path (str "resources/public/contents/" (:* params))
             file (io/file path)
             prefix (.getAbsolutePath file)
             result (sort (map #(clojure.string/replace-first (.getCanonicalPath %) prefix (:* params)) (filter #(.isFile %) (file-seq file))))]
         result))

  (GET "/comments" {params :route-params :as request}
       (let [path "resources/public/comments/"
             file (io/file path)
             prefix (.getAbsolutePath file)
             result (sort (map #(clojure.string/replace-first (.getCanonicalPath %) prefix "") (filter #(.isFile %) (file-seq file))))]
         result))

  (GET "/search/*" {params :route-params :as request}
       (let [text (:* params)
             command_name (str "find resources/public/contents resources/public/comments" " -name '*" text "*'")
             command_text (str "find resources/public/contents resources/public/comments" " -type f -exec grep -l " text " {} \\;")
             result_name (clojure.java.shell/sh "bash" "-c" command_name)
             result_text (clojure.java.shell/sh "bash" "-c" command_text)
             result_final (str (:out result_name) (:out result_text))
             files (if (= (count result_final) 0)
                     (seq ["No results"])
                     (sort (set (map #(clojure.string/replace-first % "resources/public/contents/" "") (clojure.string/split result_final #"\n")))))]
         files))
  
  (POST "/comment" {{:keys [path nick comment]} :body :as request}
        ;; todo check original post existence, check if path contains comments/
        (if (or (clojure.string/starts-with? path "/")
                (clojure.string/includes? path "..")) 
          (response/response {"error" "not today"}) ;; avoid hackers to create files outside www folder
          (let [unix (System/currentTimeMillis)
                time (get @ips (:remote-addr request))
                okay (if time
                       (> (- unix time) (* 1000 60 60))
                       true)]
            (if okay ;; check if request came within 24 hours
              (let [path (str "resources/public/" path)]
                (io/make-parents path)
                (swap! ips assoc (:remote-addr request) unix) ;; store timestamp for ip
                (with-open [wrtr (io/writer path :append true)]
                  (.write wrtr (str "<nick>" nick "</nick>"))
                  (.write wrtr (str "<comment>" comment "</comment>"))
                (response/response {"success" "true"})))
              (response/response {"error" "ip is locked for 1 hour"})))))

  (route/not-found "No Comments"))


(def app
  (-> app-routes
      (wrap-defaults (assoc-in site-defaults [:security :anti-forgery] false))
      (wrap-json-response)
      (wrap-json-body {:key-fn keyword})
      (wrap-cors
       :access-control-allow-origin [#"https://milgra.com"]
       :access-control-allow-methods [:get :post])))
