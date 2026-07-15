-- 既存のpublic.puddlesテーブルは変更しません。
-- 写真保存用のStorageバケットだけを作成・更新します。

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'puddle-photos',
  'puddle-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view puddle photos" on storage.objects;
create policy "Public can view puddle photos"
on storage.objects for select
to public
using (bucket_id = 'puddle-photos');
